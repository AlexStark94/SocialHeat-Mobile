
import React, { useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { Camera } from "expo-camera";
import { db, app } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from "firebase/firestore";
import { AuthContext } from "../context/authProvider";
import * as Location from 'expo-location';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        console.log('Not granted permission');
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (!camera) return;
    let photo = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
  
      // Upload image and save into another doc in firestore
      uploadImageAsync(photo.uri, coords);
    } catch (error) {
      console.error('Error getting the coords:', error);
    }
  };

  async function uploadImageAsync(uri, coords) {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Creates a unique reference for the image into firebase storage
    const storageRef = ref(getStorage(), `images/${new Date().toISOString()}`);

    try {
      // Puload image to Firebase storage
      await uploadBytes(storageRef, blob);

      // Get download image url
      const downloadURL = await getDownloadURL(storageRef);
      publishImage(downloadURL, coords);

      console.log("Upload succesfully. Download url:", downloadURL);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  }

  const publishImage = async (url, coords) => {
    try {
      const docRef = await addDoc(collection(db, "images"), {
        src: url,
        from: user.displayName,
        createdAt: new Date(),
        location: {
          lat: coords.latitude,
          lng: coords.longitude
        },
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {previewVisible ? (
        <ImageBackground
          source={{ uri: capturedImage && capturedImage.uri }}
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              padding: 15,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => setPreviewVisible(false)}
                style={{
                  width: 130,
                  height: 40,

                  alignItems: "center",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                  }}
                >
                  Re-take
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <Camera
          style={{ flex: 1 }}
          type={type}
          ref={(r) => {
            camera = r;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: "5%",
                left: "5%",
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 10, color: "white" }}>
                {" "}
                Flip{" "}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
                flex: 1,
                width: "100%",
                padding: 20,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={takePicture}
                  style={{
                    width: 70,
                    height: 70,
                    bottom: 0,
                    borderRadius: 50,
                    backgroundColor: "#fff",
                  }}
                />
              </View>
            </View>
          </View>
        </Camera>
      )}
    </View>
  );
}