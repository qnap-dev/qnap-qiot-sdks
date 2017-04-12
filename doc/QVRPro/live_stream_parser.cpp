bool Parser::xIsVideoFrame(DWORD dwFourcc)
{
	if( dwFourcc == *((DWORD *) "QIVG") || dwFourcc == *((DWORD *) "qIVG") || dwFourcc == *((DWORD *) "QV3K") ||
		dwFourcc == *((DWORD *) "QV6K") || dwFourcc == *((DWORD *) "qV6K") || dwFourcc == *((DWORD *) "QMP4") ||
		dwFourcc == *((DWORD *) "qMP4") || dwFourcc == *((DWORD *) "Q264") || dwFourcc == *((DWORD *) "q264") ||
		dwFourcc == *((DWORD *) "AVM4") || dwFourcc == *((DWORD *) "QXPG") )
	{
		return true;
	}
	return false;
}

bool Parser::xIsAudioFrame( DWORD dwFourcc )
{
	if( dwFourcc == *((DWORD *) "G726") || dwFourcc == *((DWORD *) "F726") || dwFourcc == *((DWORD *) "Q726") ||
		dwFourcc == *((DWORD *) "G711") || dwFourcc == *((DWORD *) "A711") || dwFourcc == FOURCC_CODE_PCM ||
		dwFourcc == FOURCC_CODE_FAAC || dwFourcc == FOURCC_CODE_QAAC || dwFourcc == FOURCC_CODE_F729 )
	{
		return true;
	}
	return false;
}

#define CGI_GET_VIO_LIVE_STREAM "GET /qvrpro/streaming/getstream.cgi?ch_sid=%s&stream_id=%d&sid=%s HTTP/1.1\r\nUser-Agent: Master\r\nHost: %s:%u\r\nAuthorization: Basic %s\r\n\r\n"
bool Parser::GetLiveStream()
{
	bool bRet = false;

	char szCgiCmd[1024];	
	char szAuthData[1024];
	char szRecvBuf[1024];
	DWORD dwTimeout =30000;

	// Base64 authorization
	CHttpTran::EncodeBase64AuthData( m_sUserName.c_str(), m_sUserPassword.c_str(), szAuthData, sizeof(szAuthData) );
	// Make the CGI string
	sprintf( szCgiCmd, CGI_GET_VIO_LIVE_STREAM, m_uChannel_SID, m_uStreamID, AUTH_SID, m_sIPAddr.c_str(), m_uPortNumber, szAuthData );

	CHttpTran HttpTran( &m_nUserAbort );
	
	do
	{
	    // Send CGI string to NVR
		if( !HttpTran.Create() )
			break;
		if( !HttpTran.Connect( m_sIPAddr.c_str(), m_uPortNumber, &dwTimeout ) )
			break;		
		if( !HttpTran.Send(szCgiCmd, strlen( szCgiCmd ), &dwTimeout) )
			break;
		// Check HTTP header
		if( HttpTran.ReadLine( szRecvBuf, sizeof( szRecvBuf ) - 1, &dwTimeout ) == 0 )
			break;
		if( HttpTran.ParserHTTPData( szRecvBuf ) != 200 )
			break;
		// Read useless new lines...
		if( HttpTran.ReadLine( szRecvBuf, sizeof( szRecvBuf ) - 1, &dwTimeout ) == 0 )
			break;		
		// Check return code of getstream.cgi
		if( HttpTran.ReadLine( szRecvBuf, sizeof( szRecvBuf ) - 1, &dwTimeout ) == 0 )
			break;
		if( atoi(szRecvBuf) != 0 ) // error
			break;
			
		HANDLE arHandles[2];
		arHandles[0] = m_hThreadTerm;
		arHandles[1] = m_hThreadSrc;

		// NVR will send the stream continuity
		for( ; ; )
		{
			DWORD dwWait = WaitForMultipleObjects( 2, arHandles, FALSE, 10 );

			if( ( dwWait == WAIT_OBJECT_0 ) || ( ( dwWait == WAIT_OBJECT_0+1 ) ) )
			{
				// User abort or source changed, stop receive data
				HttpTran.Close();
				return true;
			}

			// Read frame header...			
			int nRead = HttpTran.Receive( szRecvBuf, sizeof( VIOSTOR_FRAME_HDR ) );
			if( nRead != sizeof( VIOSTOR_FRAME_HDR ) )
			{
				// no more data?  server disconnected?
				// you may try connect later
				break;
			}
			
			/*
			QNAP Stream Header
			typedef struct {
				DWORD		FourccCode;			// fourcc code of this frame
				DWORD		dwFlags;			// Bit 0: 1-Key Frame
				DWORD		dwWidth;			// valid only if non-zero
				DWORD		dwHeight;			// valid if non-zero
				LONGLONG	llTimestamp;		// unit: ms
				BYTE		szOSDText[24];		// null terminated
				DWORD		dwReserved;			// not 0, if offset in data area...
				DWORD		dwFrameDataSize;	// size of frame data 
			} VIOSTOR_FRAME_HDR;*/
			VIOSTOR_FRAME_HDR *pHdr = (VIOSTOR_FRAME_HDR *)szRecvBuf;

			if( xIsAudioFrame( pHdr->FourccCode ) )
			{
				// Audio data
				// QNAP audio frame header
				//typedef struct {
				//	DWORD		dwSampeBits;		// Sample bits
				//	WORD		wSamplePerSecond;	// Sample per second
				//	WORD		wChannel;			// Channel count
				//}	VIOSTOR_AUDIO_HDR;
				VIOSTOR_AUDIO_HDR AudioHeader;
				// Read audio frame information...
				nRead = HttpTran.Receive( (char *)&AudioHeader, sizeof( VIOSTOR_AUDIO_HDR ) );
				if( nRead != sizeof( VIOSTOR_AUDIO_HDR ) )
				{
					// no more data?  server disconnected?
					break;
				}
				
				// Allocate your audio data buffer
				// .....................
				nRead = HttpTran.Receive( m_pInputAudioBuffer, pHdr->dwFrameDataSize - pHdr->dwReserved );
				if( nRead != ( pHdr->dwFrameDataSize - pHdr->dwReserved ) )
					break;

				// Frame is ready, process it
				// ...................
			}
			else if( xIsVideoFrame( pHdr->FourccCode ) )
			{
				// Video data
				// Allocate your video data buffer
				// .....................
				
				// copy QNAP frame header to the buffer
				memcpy( m_pInputBuffer, szRecvBuf, sizeof( VIOSTOR_FRAME_HDR ) );

				// copy frame body - the is REAL frame data, MJPEG, MPEG4, H.264 ........
				nRead = HttpTran.Receive( m_pInputBuffer + sizeof(VIOSTOR_FRAME_HDR), pHdr->dwFrameDataSize );

				// Frame is ready, process it
				// ...................
			}
		}
	} while( FALSE );
	HttpTran.Close();
	return bRet;
}