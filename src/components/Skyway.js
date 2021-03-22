import React from "react";
import { useState, useEffect, useRef } from "react";
import Peer from "skyway-js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "../utils/Firebase";
const peer = new Peer({ key: "3f631136-9dc4-4774-907e-767263560c56" });
const database = firebase.database();

const Skyway = ({ value, selected, count }) => {
    const [myId, setMyId] = useState("");
    const [state, setState] = useState(false);
    const [callId, setCallId] = useState("");
    const [mount, setMount] = useState(false);
    const [items, setItems] = useState([]);
    const localVideo = useRef(null);
    const remoteVideo = useRef(null);
    // const localStream = useRef(null);

    useEffect(() => {
        setCallId(value);
        setMount(true);
        setMyId(peer.id);
    }, [value]);
    // database.ref(value + "/count").set(count + 1);

    useEffect(() => {
        if (selected === true) {
            makeCall();
            console.log("makeCall");
        } else {
            if (mount === true) {
                leaveCall();
                console.log("leaveCall");
            }
        }
        // eslint-disable-next-line
    }, [selected]);

    peer.on("open", () => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
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
            remoteVideo.current.srcObject = stream;
            await remoteVideo.current.play().catch(console.error);
        });
                addItem();

    };

    const addItem = () => {
        setItems([
            ...items,
            <video
                key={items.id}
                width="200px"
                autoPlay
                // muted
                playsInline
                ref={remoteVideo}>
                {items.value}
            </video>,
        ]);
    };

    const leaveCall = (peerId) => {
        const mediaConnection = peer.joinRoom(callId, {
            mode: "sfu",
            stream: localVideo.current.srcObject,
        });
        // removeVideo(myId);
        mediaConnection.close();
        database.ref(value + "/count").set(count - 1);
    };



    const handleChange = (event) => {
        setState(event.target.checked);
        console.log(state);
        localVideo.current.srcObject
            .getAudioTracks()
            .forEach((track) => (track.enabled = state));
    };

    return (
        <div>
            <div>
                <video
                    width="200px"
                    autoPlay
                    muted
                    playsInline
                    ref={localVideo}></video>
            </div>
            <div>
                <FormControlLabel
                    control={
                        <Switch
                            size="small"
                            checked={state.checkedB}
                            onChange={handleChange}
                            name="checkedB"
                            color="secondary"
                        />
                    }
                    // label="On"
                />
                <FontAwesomeIcon icon={faVolumeMute} />
            </div>
            {items.map((items) => (
                <video
                    key={items.id}
                    width="200px"
                    autoPlay
                    // muted
                    playsInline
                    ref={remoteVideo}>
                    {items.value}
                </video>
            ))}
            {/* <div>
                <video
                    width="200px"
                    autoPlay
                    // muted
                    playsInline
                    ref={remoteVideo}></video>
            </div> */}
        </div>
    );
};

export default Skyway;
