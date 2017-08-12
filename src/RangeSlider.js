import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "react-native-slider";

import colors from "./colors";

export default class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.state = {
      currentIndex: 0
    };
  }

  handleValueChange(currentIndex) {
    const value = this.props.elements[currentIndex].value;
    this.setState({ currentIndex }, () => {
      if (this.props.onValueChange) this.props.onValueChange(value);
    });
  }

  render() {
    const { elements } = this.props;
    const labels = elements.map(e => e.label);
    const values = elements.map(e => e.value);
    const sliderProps = {
      minimumValue: 0,
      maximumValue: this.props.elements.length - 1,
      value: this.state.currentIndex,
      step: 1,
      maximumTrackTintColor: colors.borderLine,
      minimumTrackTintColor: colors.primaryOrange,
      thumbTintColor: colors.primaryOrange,
      thumbStyle: styles.thumb,
      trackStyle: styles.track
    };
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.labels}>
          {labels.map((lbl, idx) => {
            const activeStyle = idx === this.state.currentIndex
              ? styles.activeLabel
              : null;
            return (
              <Text
                key={lbl}
                style={[styles.label, styles.labelsOffset, activeStyle]}
              >
                {lbl}
              </Text>
            );
          })}
        </View>
        <View style={[styles.labels, styles.trackStepsContainer]}>
          {values.map((v, idx) => {
            const activeTrackStep = idx <= this.state.currentIndex
              ? styles.activeTrackStep
              : null;
            return <View key={v} style={[styles.trackStep, activeTrackStep]} />;
          })}
        </View>
        <Slider {...sliderProps} onValueChange={this.handleValueChange} />
      </View>
    );
  }
}

const THUMB_SIZE = 25;
const LABELS_PADDING_LEFT = 4;
const LABELS_PADDING_RIGHT = -5;

const styles = StyleSheet.create({
  track: {
    height: 6
  },
  thumb: {
    height: THUMB_SIZE,
    width: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2
  },
  trackStepsContainer: {
    position: "absolute",
    top: THUMB_SIZE - 3,
    left: 0,
    right: 0,
    bottom: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  activeTrackStep: {
    backgroundColor: colors.primaryOrange
  },
  trackStep: {
    height: THUMB_SIZE,
    width: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.borderLine
  },
  activeLabel: {
    fontSize: 17,
    color: colors.primaryOrange
  },
  label: {
    fontWeight: "600",
    color: "#757575"
  },
  labelsOffset: {
    paddingLeft: LABELS_PADDING_LEFT,
    paddingRight: LABELS_PADDING_RIGHT
  },
  labels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  container: {
    alignSelf: "stretch"
  }
});
