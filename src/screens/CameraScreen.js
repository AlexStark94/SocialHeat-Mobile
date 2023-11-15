
import React, { useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, ImageBackground, Dimensions, Image } from "react-native";
import { Camera } from "expo-camera";
import { db, app, getUserDocument } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from "firebase/firestore";
import { AuthContext } from "../context/authProvider";
import * as Location from 'expo-location';
import FormInput from "../components/formInput";
import FormButton from "../components/formButton";

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const { user } = useContext(AuthContext);

  const screenWidth = Dimensions.get('window').width;
  const [userData, setUserData] = useState('');
  const [storageRef, setStorageRef] = useState(null);
  const [blobRef, setBlobRef] = useState(null)
  const [description, setDescription] = useState('');
  const [savedCoords, setSavedCoords] = useState(null)

  useEffect(() => {
    const fetchUserDocument = async () => {
      const userDocument = await getUserDocument(user.email);
      setUserData(userDocument);
    };

    fetchUserDocument();
  }, []);

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
    const storageRefUnique = ref(getStorage(), `images/${new Date().toISOString()}`);

    setSavedCoords(coords)
    setStorageRef(storageRefUnique);
    setBlobRef(blob)
  }

  const uploadToFirebase = async () => {
    try {
      // Puload image to Firebase storage
      await uploadBytes(storageRef, blobRef);

      // Get download image url
      const downloadURL = await getDownloadURL(storageRef);
      publishImage(downloadURL, savedCoords);

      console.log("Upload succesfully. Download url:", downloadURL);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  }

  const publishImage = async (url, coords) => {
    try {
      const docRef = await addDoc(collection(db, "clients", "Catalina_1700005261133", "posts"), {
        img: url,
        user: user.displayName,
        timestamp: new Date(),
        location: {
          lat: coords.latitude,
          lng: coords.longitude
        },
        likes: 10,
        dislikes: 3,
        description
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
        <View style={{
          backgroundColor: '#FFF',
          padding: 16,
          paddingTop: 60,
          flex: 1,
        }}>
          <ImageBackground
            source={{ uri: capturedImage && capturedImage.uri }}
            style={{
              width: '100%',
              height: 200,
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
                  alignItems: 'end'
                }}
              >
                <TouchableOpacity
                  onPress={() => setPreviewVisible(false)}
                  style={{
                    width: '100%',
                    height: 20,
                    alignItems: "center",
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 14,
                    }}
                  >
                    Re-take
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.contentContainer}>
            <Image
              style={styles.image}
              source={{ uri: userData?.profileImg }}
            />
            <FormInput
              value={description}
              placeholder='Add some description...'
              autoCapitalize='none'
              onChangeText={(e) => setDescription(e)}
              style={{
                width: screenWidth - 88,
                marginLeft: 8
              }}
            />
          </View>

          <FormButton
            onPress={() => uploadToFirebase()}
            modeValue='contained'
            title={"UPLOAD"}
          />

          {/* uploadToFirebase */}

        </View>
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

const styles = {
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 20
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
}