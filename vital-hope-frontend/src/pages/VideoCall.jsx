// import { useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import socket from "../socket/socket";

// function VideoCall() {
//   const { roomId } = useParams();

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   const peerConnection = useRef(null);
//   const localStream = useRef(null);
//   const pendingCandidates = useRef([]);

//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" },
//       { urls: "stun:stun1.l.google.com:19302" }
//     ]
//   };

//   useEffect(() => {
//     initCall();

//     return () => {
//       cleanup();
//     };
//   }, []);

//   const initCall = async () => {
//     try {
//       // 1️⃣ Get media
//       localStream.current = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });

//       localVideoRef.current.srcObject = localStream.current;

//       // 2️⃣ Create PeerConnection
//       peerConnection.current = new RTCPeerConnection(configuration);

//       // 3️⃣ Add tracks
//       localStream.current.getTracks().forEach((track) => {
//         peerConnection.current.addTrack(track, localStream.current);
//       });

//       // 4️⃣ Remote stream
//       peerConnection.current.ontrack = (event) => {
//         console.log("Remote track received");
//         remoteVideoRef.current.srcObject = event.streams[0];
//       };

//       // 5️⃣ ICE handling
//       peerConnection.current.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit("iceCandidate", {
//             roomId,
//             candidate: event.candidate
//           });
//         }
//       };

//       // 6️⃣ Join room
//       socket.emit("joinRoom", { roomId });

//       // 7️⃣ When both users ready → first user creates offer
//       socket.on("readyToCall", async () => {
//         console.log("Both users joined. Creating offer...");
//         await createOffer();
//       });

//       // 8️⃣ Signaling listeners
//       socket.on("offer", handleReceiveOffer);
//       socket.on("answer", handleReceiveAnswer);
//       socket.on("iceCandidate", handleReceiveIce);

//     } catch (error) {
//       console.error("Init Call Error:", error);
//     }
//   };

//   const createOffer = async () => {
//     console.log("Creating offer...");

//     const offer = await peerConnection.current.createOffer();

//     await peerConnection.current.setLocalDescription(offer);

//     console.log("Offer sent");

//     socket.emit("offer", {
//       roomId,
//       offer
//     });
//   };

//   const handleReceiveOffer = async (offer) => {
//     console.log("Offer received");

//     if (peerConnection.current.signalingState !== "stable") {
//       return;
//     }

//     await peerConnection.current.setRemoteDescription(
//       new RTCSessionDescription(offer)
//     );

//     const answer = await peerConnection.current.createAnswer();

//     await peerConnection.current.setLocalDescription(answer);

//     console.log("Answer sent");

//     socket.emit("answer", {
//       roomId,
//       answer
//     });

//     flushPendingCandidates();
//   };

//   const handleReceiveAnswer = async (answer) => {
//     console.log("Answer received");

//     if (
//       peerConnection.current.signalingState !== "have-local-offer"
//     ) {
//       return;
//     }

//     await peerConnection.current.setRemoteDescription(
//       new RTCSessionDescription(answer)
//     );

//     flushPendingCandidates();
//   };

//   const handleReceiveIce = async (candidate) => {
//     if (
//       peerConnection.current.remoteDescription &&
//       peerConnection.current.remoteDescription.type
//     ) {
//       await peerConnection.current.addIceCandidate(
//         new RTCIceCandidate(candidate)
//       );
//     } else {
//       pendingCandidates.current.push(candidate);
//     }
//   };

//   const flushPendingCandidates = async () => {
//     for (const candidate of pendingCandidates.current) {
//       await peerConnection.current.addIceCandidate(
//         new RTCIceCandidate(candidate)
//       );
//     }
//     pendingCandidates.current = [];
//   };

//   const cleanup = () => {
//     socket.off("readyToCall");
//     socket.off("offer");
//     socket.off("answer");
//     socket.off("iceCandidate");

//     if (peerConnection.current) {
//       peerConnection.current.close();
//     }

//     if (localStream.current) {
//       localStream.current.getTracks().forEach((track) => track.stop());
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Video Call Room: {roomId}</h2>

//       <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{ width: "300px", background: "black" }}
//         />

//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           style={{ width: "300px", background: "black" }}
//         />
//       </div>
//     </div>
//   );
// }

// export default VideoCall;
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket";

function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const pendingCandidates = useRef([]);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  };

  useEffect(() => {
    initCall();

    return () => {
      cleanup();
    };
  }, []);

  const initCall = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localVideoRef.current.srcObject = localStream.current;

      peerConnection.current = new RTCPeerConnection(configuration);

      localStream.current.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      peerConnection.current.ontrack = (event) => {
        console.log("Remote track received");
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            roomId,
            candidate: event.candidate
          });
        }
      };

      socket.emit("joinRoom", { roomId });

      socket.on("readyToCall", async () => {
        console.log("Both users joined. Creating offer...");
        await createOffer();
      });

      socket.on("offer", handleReceiveOffer);
      socket.on("answer", handleReceiveAnswer);
      socket.on("iceCandidate", handleReceiveIce);

    } catch (error) {
      console.error("Init Call Error:", error);
    }
  };

  const createOffer = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("offer", {
      roomId,
      offer
    });
  };

  const handleReceiveOffer = async (offer) => {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit("answer", {
      roomId,
      answer
    });

    flushPendingCandidates();
  };

  const handleReceiveAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    flushPendingCandidates();
  };

  const handleReceiveIce = async (candidate) => {
    if (peerConnection.current.remoteDescription) {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } else {
      pendingCandidates.current.push(candidate);
    }
  };

  const flushPendingCandidates = async () => {
    for (const candidate of pendingCandidates.current) {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    }
    pendingCandidates.current = [];
  };

  const toggleMic = () => {
    localStream.current.getAudioTracks()[0].enabled =
      !localStream.current.getAudioTracks()[0].enabled;
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    localStream.current.getVideoTracks()[0].enabled =
      !localStream.current.getVideoTracks()[0].enabled;
    setCameraOn(!cameraOn);
  };

  const endCall = () => {
    cleanup();
    navigate("/");
  };

  const cleanup = () => {
    socket.off("readyToCall");
    socket.off("offer");
    socket.off("answer");
    socket.off("iceCandidate");

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div style={{ height: "100vh", background: "#111", position: "relative" }}>

      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />

      {/* Local Video */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "200px",
          position: "absolute",
          top: "20px",
          right: "20px",
          borderRadius: "10px",
          border: "2px solid white"
        }}
      />

      {/* Control Bar */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "20px"
        }}
      >
        <button onClick={toggleMic}>
          {micOn ? "Mute Mic" : "Unmute Mic"}
        </button>

        <button onClick={toggleCamera}>
          {cameraOn ? "Camera Off" : "Camera On"}
        </button>

        <button
          onClick={endCall}
          style={{ background: "red", color: "white" }}
        >
          End Call
        </button>
      </div>
    </div>
  );
}

export default VideoCall;