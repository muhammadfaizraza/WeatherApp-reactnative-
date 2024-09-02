import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RootLayout from "./app/_layout";
const app = () => {
  return (
    <>
      <RootLayout />
    </>
  );
};

export default app;

// App.js

import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});
const styles = StyleSheet.create({});
