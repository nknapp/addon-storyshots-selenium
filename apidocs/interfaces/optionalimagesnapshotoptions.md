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
[src/types.ts:79](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L79)_

---

### beforeEachScreenshot

• **beforeEachScreenshot**:
_[BeforeScreenshotsFunction](../README.md#beforescreenshotsfunction)_

_Defined in
[src/types.ts:78](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L78)_

---

### beforeFirstScreenshot

• **beforeFirstScreenshot**:
_[BeforeScreenshotsFunction](../README.md#beforescreenshotsfunction)_

_Defined in
[src/types.ts:77](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L77)_

---

### getMatchOptions

• **getMatchOptions**:
_[GetMatchOptionsFunction](../README.md#getmatchoptionsfunction)_

_Defined in
[src/types.ts:80](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L80)_

---

### seleniumUrl

• **seleniumUrl**: _string_

_Defined in
[src/types.ts:69](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L69)_

URL to the selenium server

---

### setupTimeoutMillis

• **setupTimeoutMillis**: _number_

_Defined in
[src/types.ts:75](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L75)_

---

### sizes

• **sizes**: _[WidthXHeightString](../README.md#widthxheightstring)[]_

_Defined in
[src/types.ts:59](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L59)_

A list of screen sizes to take screenshots in.

---

### snapshotBaseDirectory

• **snapshotBaseDirectory**: _string_

_Defined in
[src/types.ts:81](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L81)_

---

### storybookUrl

• **storybookUrl**: _string_

_Defined in
[src/types.ts:64](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L64)_

URL to the storybook server (which is not started by this module)

---

### teardownTimeoutMillis

• **teardownTimeoutMillis**: _number_

_Defined in
[src/types.ts:76](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L76)_

---

### testTimeoutMillis

• **testTimeoutMillis**: _number_

_Defined in
[src/types.ts:74](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L74)_

Timeout
