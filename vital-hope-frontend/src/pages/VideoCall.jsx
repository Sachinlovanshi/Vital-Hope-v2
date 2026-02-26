import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";

function VideoCall() {
  const { roomId } = useParams();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const pendingCandidates = useRef([]);

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
      // 1️⃣ Get media
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localVideoRef.current.srcObject = localStream.current;

      // 2️⃣ Create PeerConnection
      peerConnection.current = new RTCPeerConnection(configuration);

      // 3️⃣ Add tracks
      localStream.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      // 4️⃣ Remote stream
      peerConnection.current.ontrack = (event) => {
        console.log("Remote track received");
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      // 5️⃣ ICE handling
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            roomId,
            candidate: event.candidate
          });
        }
      };

      // 6️⃣ Join room
      socket.emit("joinRoom", { roomId });

      // 7️⃣ When both users ready → first user creates offer
      socket.on("readyToCall", async () => {
        console.log("Both users joined. Creating offer...");
        await createOffer();
      });

      // 8️⃣ Signaling listeners
      socket.on("offer", handleReceiveOffer);
      socket.on("answer", handleReceiveAnswer);
      socket.on("iceCandidate", handleReceiveIce);

    } catch (error) {
      console.error("Init Call Error:", error);
    }
  };

  const createOffer = async () => {
    console.log("Creating offer...");

    const offer = await peerConnection.current.createOffer();

    await peerConnection.current.setLocalDescription(offer);

    console.log("Offer sent");

    socket.emit("offer", {
      roomId,
      offer
    });
  };

  const handleReceiveOffer = async (offer) => {
    console.log("Offer received");

    if (peerConnection.current.signalingState !== "stable") {
      return;
    }

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnection.current.createAnswer();

    await peerConnection.current.setLocalDescription(answer);

    console.log("Answer sent");

    socket.emit("answer", {
      roomId,
      answer
    });

    flushPendingCandidates();
  };

  const handleReceiveAnswer = async (answer) => {
    console.log("Answer received");

    if (
      peerConnection.current.signalingState !== "have-local-offer"
    ) {
      return;
    }

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    flushPendingCandidates();
  };

  const handleReceiveIce = async (candidate) => {
    if (
      peerConnection.current.remoteDescription &&
      peerConnection.current.remoteDescription.type
    ) {
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

  const cleanup = () => {
    socket.off("readyToCall");
    socket.off("offer");
    socket.off("answer");
    socket.off("iceCandidate");

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Video Call Room: {roomId}</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "300px", background: "black" }}
        />

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "300px", background: "black" }}
        />
      </div>
    </div>
  );
}

export default VideoCall;
