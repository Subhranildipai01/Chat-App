// src/components/CallComponent.js

import React, { useEffect, useRef } from 'react';
import io from 'socket.js';

const socket = io('http://localhost:5000/'); // Connect to your backend Socket.IO server

const CallComponent = () => {
  const peerConnectionRef = useRef(new RTCPeerConnection());

  useEffect(() => {
    const startCall = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.getTracks().forEach((track) => peerConnectionRef.current.addTrack(track, localStream));

        socket.emit('start-call', { recipientId: 'recipientSocketId' });

        socket.on('offer', async ({ offer }) => {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);

          socket.emit('answer', { callerId: 'callerSocketId', answer });
        });

        socket.on('answer', async ({ answer }) => {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('ice-candidate', ({ candidate }) => {
          peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', { targetId: 'calleeSocketId', candidate: event.candidate });
          }
        };
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    startCall();

    return () => {
      // Cleanup logic (e.g., close peer connection, release resources)
      peerConnectionRef.current.close();
    };
  }, []);

  return (
    <div>
      {/* UI components for call controls, video display, etc. */}
      <video ref={(video) => (video.srcObject = localStream)} autoPlay muted />
    </div>
  );
};

export default CallComponent;
