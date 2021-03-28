import React from "react";
import { useState, useEffect, useRef } from "react";
import Peer from "skyway-js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "../utils/Firebase";
const database = firebase.database();
const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY });

const Skyway = ({ value, selected, count }) => {
    const [state, setState] = useState(true);
    const [callId, setCallId] = useState("");
    const [mount, setMount] = useState(false);
    const [remoteVideoData, setRemoteVideoData] = useState([]);
    const [connect, setConnect] = useState(false);
    const localVideo = useRef(null);
    const remoteVideo = useRef(null);

    useEffect(() => {
        setCallId(value);
        setMount(true);
    }, [value]);

    useEffect(() => {
        if (selected === true) {
            makeCall();
            database.ref(value + "/count").set(count + 1);
        } else {
            if (mount === true) {
                leaveCall();
                if (count > 0) {
                    database.ref(value + "/count").set(count - 1);
                }
            }
        }
        // eslint-disable-next-line
    }, [selected]);

    peer.on("open", () => {
        navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((localStream) => {
                localVideo.current.srcObject = localStream;
            });
    });

    peer.on("call", (mediaConnection) => {
        mediaConnection.answer(localVideo.current.srcObject);
        mediaConnection.on("stream", async (stream) => {
            remoteVideo.current.srcObject = stream;
        });
    });

    const makeCall = () => {
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
        setConnect(true);
    };

    const leaveCall = () => {
        const mediaConnection = peer.joinRoom(callId, {
            mode: "sfu",
            stream: localVideo.current.srcObject,
        });
        mediaConnection.close();
        setConnect(false);
    };

    if (connect === true && count > 0 ) {
        database
            .ref(value + "/count")
            .onDisconnect()
            .set(count - 1);
    }

    const handleChange = (event) => {
        setState(event.target.checked);
        // console.log(state);
        localVideo.current.srcObject
            .getAudioTracks()
            .forEach((track) => (track.enabled = state));
    };

    const RemoteVideo = (props) => {
        const videoRef = useRef();
        useEffect(() => {
            videoRef.current.srcObject = props.videoData;
        });
        return (
            <div className="remoteVideo">
                <audio
                    // width="200px"
                    autoPlay
                    // playsInline
                    // muted
                    ref={videoRef}></audio>
            </div>
        );
    };

    return (
        <div>
            <div>
                <audio
                    // width="200px"
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
                    // label="On"
                />
                {state ? (<FontAwesomeIcon icon={faMicrophoneSlash} />) : (
                    <FontAwesomeIcon icon={faMicrophone} />
                )}
            </div>
            {remoteVideoData.map((videoData, index) => {
                return <RemoteVideo key={index} videoData={videoData} />;
            })}
        </div>
    );
};

export default Skyway;
