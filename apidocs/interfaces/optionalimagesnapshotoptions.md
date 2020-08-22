[@knappi/addon-storyshots-selenium](../README.md) ›
[OptionalImageSnapshotOptions](optionalimagesnapshotoptions.md)

# Interface: OptionalImageSnapshotOptions

## Hierarchy

- **OptionalImageSnapshotOptions**

## Index

### Properties

- [afterEachScreenshot](optionalimagesnapshotoptions.md#aftereachscreenshot)
- [beforeEachScreenshot](optionalimagesnapshotoptions.md#beforeeachscreenshot)
- [beforeFirstScreenshot](optionalimagesnapshotoptions.md#beforefirstscreenshot)
- [getMatchOptions](optionalimagesnapshotoptions.md#getmatchoptions)
- [seleniumUrl](optionalimagesnapshotoptions.md#seleniumurl)
- [setupTimeoutMillis](optionalimagesnapshotoptions.md#setuptimeoutmillis)
- [sizes](optionalimagesnapshotoptions.md#sizes)
- [snapshotBaseDirectory](optionalimagesnapshotoptions.md#snapshotbasedirectory)
- [storybookUrl](optionalimagesnapshotoptions.md#storybookurl)
- [teardownTimeoutMillis](optionalimagesnapshotoptions.md#teardowntimeoutmillis)
- [testTimeoutMillis](optionalimagesnapshotoptions.md#testtimeoutmillis)

## Properties

### afterEachScreenshot

• **afterEachScreenshot**:
_[AfterEachScreenshotFunction](../README.md#aftereachscreenshotfunction)_

_Defined in
[src/types.ts:94](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L94)_

---

### beforeEachScreenshot

• **beforeEachScreenshot**:
_[BeforeEachScreenshotFunction](../README.md#beforeeachscreenshotfunction)_

_Defined in
[src/types.ts:93](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L93)_

---

### beforeFirstScreenshot

• **beforeFirstScreenshot**:
_[BeforeFirstScreenshotFunction](../README.md#beforefirstscreenshotfunction)_

_Defined in
[src/types.ts:92](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L92)_

---

### getMatchOptions

• **getMatchOptions**:
_[GetMatchOptionsFunction](../README.md#getmatchoptionsfunction)_

_Defined in
[src/types.ts:95](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L95)_

---

### seleniumUrl

• **seleniumUrl**: _string_

_Defined in
[src/types.ts:84](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L84)_

URL to the selenium server

---

### setupTimeoutMillis

• **setupTimeoutMillis**: _number_

_Defined in
[src/types.ts:90](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L90)_

---

### sizes

• **sizes**: _[WidthXHeightString](../README.md#widthxheightstring)[]_

_Defined in
[src/types.ts:74](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L74)_

A list of screen sizes to take screenshots in.

---

### snapshotBaseDirectory

• **snapshotBaseDirectory**: _string_

_Defined in
[src/types.ts:96](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L96)_

---

### storybookUrl

• **storybookUrl**: _string_

_Defined in
[src/types.ts:79](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L79)_

URL to the storybook server (which is not started by this module)

---

### teardownTimeoutMillis

• **teardownTimeoutMillis**: _number_

_Defined in
[src/types.ts:91](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L91)_

---

### testTimeoutMillis

• **testTimeoutMillis**: _number_

_Defined in
[src/types.ts:89](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L89)_

Timeout
