import React, { useState } from "react";
import { View, Button, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 📷 Step 1: Pick image from camera or gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ☁️ Step 2: Upload to Firebase Storage
  const uploadImage = async () => {
    if (!image) return Alert.alert("No image selected!");

    try {
      setUploading(true);

      const response = await fetch(image);
      const blob = await response.blob();
      const fileName = `images/${Date.now()}.jpg`;

      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      Alert.alert("✅ Upload successful!", `Image URL:\n${downloadURL}`);
      setImage(null);
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Upload failed", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginBottom: 20, borderRadius: 10 }}
        />
      )}

      <Button title="Pick Image" onPress={pickImage} />
      <View style={{ marginVertical: 10 }} />
      {uploading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Upload Image" onPress={uploadImage} />
      )}
    </View>
  );
};

export default ImageUpload;