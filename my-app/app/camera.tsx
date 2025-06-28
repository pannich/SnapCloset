import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Reset camera when returning from preview
  useEffect(() => {
    if (!capturedPhoto && cameraRef.current) {
      // Small delay to ensure camera is ready
      const timer = setTimeout(() => {
        // Camera should be ready now
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [capturedPhoto]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        setCapturedPhoto(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const retakePicture = () => {
    try {
      setCapturedPhoto(null);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error in retakePicture:', error);
      // Fallback: go back to home screen
      router.back();
    }
  };

  const getAIAnalysis = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert(
        'AI Style Analysis',
        'Your outfit looks great! Here are some suggestions:\n\n• The color combination works well\n• Consider adding a statement accessory\n• This style suits your body type perfectly\n\nWould you like to save this outfit?',
        [
          {
            text: 'Save Outfit',
            onPress: () => {
              setCapturedPhoto(null);
              router.back();
            },
          },
          {
            text: 'Take Another',
            onPress: retakePicture,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }, 2000);
  };

  const toggleCameraType = () => {
    setType((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {permission ? 'No access to camera' : 'Requesting camera permission...'}
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={type}
        flash={flash}
        ref={cameraRef}
      >
        {/* Photo Preview Overlay */}
        {capturedPhoto && (
          <View style={styles.previewOverlay}>
            <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />

            {/* Preview Header */}
            <View style={styles.previewHeader}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.back()}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Photo Preview</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Preview Controls */}
            <View style={styles.previewControls}>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={retakePicture}
              >
                <Ionicons name="refresh" size={24} color="white" />
                <Text style={styles.previewButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.previewButton, styles.analyzeButton]}
                onPress={getAIAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Ionicons name="hourglass" size={24} color="white" />
                    <Text style={styles.previewButtonText}>Analyzing...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="sparkles" size={24} color="white" />
                    <Text style={styles.previewButtonText}>Get AI Analysis</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Camera UI - Only show when not in preview */}
        {!capturedPhoto && (
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.back()}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Capture Your Style</Text>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={toggleFlash}
              >
                <Ionicons
                  name={flash === 'on' ? "flash" : "flash-off"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {/* Camera Controls */}
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraType}
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                Position yourself in the frame and tap the button to capture
              </Text>
            </View>
          </>
        )}
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  permissionButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  placeholder: {
    width: 50,
    height: 50,
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instructionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  // Preview styles
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  previewControls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: 'center',
  },
  analyzeButton: {
    backgroundColor: '#667eea',
  },
  previewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
