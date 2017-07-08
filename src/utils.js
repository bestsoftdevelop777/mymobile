import React, { Component } from "react";
import { ToastAndroid, Alert, Platform } from "react-native";

export function getDateStr(datetime) {
  const day = datetime.getDate();
  const month = datetime.getMonth();
  const year = datetime.getFullYear();
  let hour = datetime.getHours();
  const minute = datetime.getMinutes();
  if (hour > 12) {
    meridien = "PM";
    hour -= 12;
  } else {
    meridien = "AM";
  }
  const dateStr = `${hour}:${minute}${meridien} ${day}-${month}-${year}`;
  return dateStr;
}

export function addCommas(nStr) {
  nStr += "";
  x = nStr.split(".");
  x1 = x[0];
  x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

export function prettifyCamelCase(str) {
  var output = "";
  var len = str.length;
  var char;

  for (var i = 0; i < len; i++) {
    char = str.charAt(i);

    if (i == 0) {
      output += char.toUpperCase();
    } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
      output += " " + char;
    } else if (char == "-" || char == "_") {
      output += " ";
    } else {
      output += char;
    }
  }

  return output;
}

export function showAlert(text, cb) {
  if (Platform.OS === "ios") {
    Alert.alert(text, null, [
      {
        text: "OK",
        onPress: cb
      }
    ]);
  } else {
    ToastAndroid.show(text, ToastAndroid.LONG);
    cb();
  }
}
