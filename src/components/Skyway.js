import React from "react";
import { useState, useEffect, useRef } from "react";
import Peer from "skyway-js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {
    faMicrophone,
    faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "../utils/Firebase";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

const database = firebase.database();
const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY });

const Skyway = ({ value, selected, count, color, setVideoCount }) => {
    const [state, setState] = useState(true);
    const [callId, setCallId] = useState(1);
    const [mount, setMount] = useState(false);
    const [remoteVideoData, setRemoteVideoData] = useState([]);
    const [connect, setConnect] = useState(false);
    const localVideo = useRef(null);
    const { transcript } = useSpeechRecognition();

    useEffect(() => {
        setCallId(value);
        setMount(true);
    }, [value]);

    useEffect(() => {
        if (selected === true) {
            makeCall();
            database.ref("data/" + value + "/count").set(count + 1);
        } else {
            if (mount === true) {
                leaveCall();
                if (count > 0) {
                    database.ref("data/" + value + "/count").set(count - 1);
                }
            }
        }
        // eslint-disable-next-line
    }, [selected]);

    useEffect(() => {
        database.ref("text/" + value + "/listen").set(transcript);
        // if (transcript.length > 40) {
        //     resetTranscript();
        // }
        database.ref("text/" + value + "/color").set(color);
        // eslint-disable-next-line
    }, [transcript]);

    const makeCall = () => {
        navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((localStream) => {
                localVideo.current.srcObject = localStream;
                localVideo.current.srcObject
                    .getAudioTracks()
                    .forEach((track) => (track.enabled = false));
                setConnect(true);
                const mediaConnection = peer.joinRoom(callId, {
                    mode: "sfu",
                    stream: localVideo.current.srcObject,
                });
                mediaConnection.on("stream", async (stream) => {
                    setRemoteVideoData((oldRemoteVideoData) => [
                        ...oldRemoteVideoData,
                        stream,
                    ]);
                });
            });
    };

    const leaveCall = () => {
        const allVideo = [];
        setRemoteVideoData(allVideo);
        const mediaConnection = peer.joinRoom(callId, {
            mode: "sfu",
            stream: localVideo.current.srcObject,
        });
        mediaConnection.close();
        localVideo.current.srcObject = null;
        setState(true);
        setConnect(false);
        stopHandle();
    };

    if (connect === true && count > 0) {
        database
            .ref("data/" + value + "/count")
            .onDisconnect()
            .set(count - 1);
    }

    database
        .ref("text/" + value + "/listen")
        .onDisconnect()
        .set("");

    database
        .ref("text/" + value + "/speak")
        .onDisconnect()
        .set("");

    const handleChange = (event) => {
        setState(event.target.checked);
        localVideo.current.srcObject
            .getAudioTracks()
            .forEach((track) => (track.enabled = state));
        if (state === true) {
            handleListing();
        } else {
            stopHandle();
        }
    };

    const handleListing = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: "ja",
        });
    };

    const stopHandle = () => {
        SpeechRecognition.stopListening();
    };

    const RemoteVideo = ({ videoData }) => {
        const videoRef = useRef();
        useEffect(() => {
            videoRef.current.srcObject = videoData;
        });
        return (
            <div className="remoteVideo">
                <audio
                    // width="60px"
                    autoPlay
                    // playsInline
                    // muted
                    ref={videoRef}></audio>
            </div>
        );
    };

    const VideoEffect = () => {
        const videoPeer = remoteVideoData.filter((videoData) => {
            return videoData.active !== false;
        });
        const videovideo = videoPeer.length;
        setVideoCount(videovideo);
        return (
            <div>
                <span>{setVideoCount(videovideo)}</span>
                {videoPeer.map((videoData, index) => {
                    return <RemoteVideo key={index} videoData={videoData} />;
                })}
            </div>
        );
    };
    return (
        <div>
            <div>
                <audio
                    // width="60px"
                    autoPlay
                    muted
                    // playsInline
                    ref={localVideo}></audio>
            </div>
            <div>
                <FormControlLabel
                    control={
                        <Switch
                            disabled={connect === false}
                            size="small"
                            checked={state}
                            onChange={handleChange}
                            color="secondary"
                        />
                    }
                />
                {state ? (
                    <FontAwesomeIcon icon={faMicrophoneSlash} />
                ) : (
                    <FontAwesomeIcon icon={faMicrophone} />
                )}
            </div>
            <VideoEffect />
        </div>
    );
};

export default Skyway;
