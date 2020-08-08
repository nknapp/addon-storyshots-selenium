[@knappi/addon-storyshots-selenium](README.md)

# @knappi/addon-storyshots-selenium

## Index

### Interfaces

- [AfterEachScreenshotOptions](interfaces/aftereachscreenshotoptions.md)
- [BeforeScreenshotsOptions](interfaces/beforescreenshotsoptions.md)
- [BrowserSpecification](interfaces/browserspecification.md)
- [LifeCycleMethod](interfaces/lifecyclemethod.md)
- [OptionalImageSnapshotOptions](interfaces/optionalimagesnapshotoptions.md)
- [RequiredImageSnapshotOptions](interfaces/requiredimagesnapshotoptions.md)
- [StorybookContext](interfaces/storybookcontext.md)
- [StorybookStory](interfaces/storybookstory.md)
- [TestMethod](interfaces/testmethod.md)

### Type aliases

- [AfterEachScreenshotFunction](README.md#aftereachscreenshotfunction)
- [BeforeScreenshotsFunction](README.md#beforescreenshotsfunction)
- [GetMatchOptionsFunction](README.md#getmatchoptionsfunction)
- [ImageSnapshotOptions](README.md#imagesnapshotoptions)
- [InternalImageSnapshotOptions](README.md#internalimagesnapshotoptions)
- [VoidAsyncFunction](README.md#voidasyncfunction)
- [WidthXHeightString](README.md#widthxheightstring)

### Variables

- [sectionDebug](README.md#const-sectiondebug)

### Functions

- [doNothing](README.md#donothing)
- [imageSnapshot](README.md#imagesnapshot)
- [waitMillis](README.md#waitmillis)

## Type aliases

### AfterEachScreenshotFunction

Ƭ **AfterEachScreenshotFunction**: _function_

_Defined in
[src/types.ts:38](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L38)_

#### Type declaration:

▸ (`options`:
[AfterEachScreenshotOptions](interfaces/aftereachscreenshotoptions.md)):
_Promise‹void›_

**Parameters:**

| Name      | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `options` | [AfterEachScreenshotOptions](interfaces/aftereachscreenshotoptions.md) |

---

### BeforeScreenshotsFunction

Ƭ **BeforeScreenshotsFunction**: _function_

_Defined in
[src/types.ts:31](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L31)_

#### Type declaration:

▸ (`options`:
[BeforeScreenshotsOptions](interfaces/beforescreenshotsoptions.md)):
_Promise‹void›_

**Parameters:**

| Name      | Type                                                               |
| --------- | ------------------------------------------------------------------ |
| `options` | [BeforeScreenshotsOptions](interfaces/beforescreenshotsoptions.md) |

---

### GetMatchOptionsFunction

Ƭ **GetMatchOptionsFunction**: _function_

_Defined in
[src/types.ts:40](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L40)_

#### Type declaration:

▸ (`context`: [StorybookContext](interfaces/storybookcontext.md) |
any, `screenshotUrl`: string, `size`:
[WidthXHeightString](README.md#widthxheightstring)): _void |
Promise‹MatchImageSnapshotOptions | void›_

**Parameters:**

| Name            | Type                                                          |
| --------------- | ------------------------------------------------------------- |
| `context`       | [StorybookContext](interfaces/storybookcontext.md) &#124; any |
| `screenshotUrl` | string                                                        |
| `size`          | [WidthXHeightString](README.md#widthxheightstring)            |

---

### ImageSnapshotOptions

Ƭ **ImageSnapshotOptions**:
_Partial‹[OptionalImageSnapshotOptions](interfaces/optionalimagesnapshotoptions.md)›
&
[RequiredImageSnapshotOptions](interfaces/requiredimagesnapshotoptions.md)_

_Defined in
[src/types.ts:90](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L90)_

---

### InternalImageSnapshotOptions

Ƭ **InternalImageSnapshotOptions**:
_[OptionalImageSnapshotOptions](interfaces/optionalimagesnapshotoptions.md)
&
[RequiredImageSnapshotOptions](interfaces/requiredimagesnapshotoptions.md)_

_Defined in
[src/types.ts:84](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L84)_

---

### VoidAsyncFunction

Ƭ **VoidAsyncFunction**: _function_

_Defined in
[src/public-utils.ts:4](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/public-utils.ts#L4)_

A function that returns a void-promise

#### Type declaration:

▸ (): _Promise‹void›_

---

### WidthXHeightString

Ƭ **WidthXHeightString**: _string_

_Defined in
[src/types.ts:23](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L23)_

String of the form "1000x800"

## Variables

### `Const` sectionDebug

• **sectionDebug**: _SectionDebug_ =
createSectionDebug(createDebug("addon-storyshots-selenium:index-trace"))

_Defined in
[src/index.ts:12](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/index.ts#L12)_

## Functions

### doNothing

▸ **doNothing**(): _[VoidAsyncFunction](README.md#voidasyncfunction)_

_Defined in
[src/public-utils.ts:20](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/public-utils.ts#L20)_

returns an async function that resolves immediately, without doing
anything.

**Returns:** _[VoidAsyncFunction](README.md#voidasyncfunction)_

---

### imageSnapshot

▸ **imageSnapshot**(`options`:
[ImageSnapshotOptions](README.md#imagesnapshotoptions)):
_[TestMethod](interfaces/testmethod.md)_

_Defined in
[src/index.ts:27](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/index.ts#L27)_

Create and compare image snapshots as part of the storyshots addon.
The resulting function has `beforeAll` and `afterAll`-hooks attached.
Althogether, the following process will be performed:

- Setup selenium-drivers for all specified browsers
- For all drivers in parallel, perform the following steps:
  - Iterate through the stories. For each story
    - open the story in the browser
    - resize the browser to the specified window sizes
    - take a screenshot of the window
    - compare the screenshot to the baseline-version in the project.
- Close down all drivers.

**Parameters:**

| Name      | Type                                                   |
| --------- | ------------------------------------------------------ |
| `options` | [ImageSnapshotOptions](README.md#imagesnapshotoptions) |

**Returns:** _[TestMethod](interfaces/testmethod.md)_

---

### waitMillis

▸ **waitMillis**(`millis`: number):
_[VoidAsyncFunction](README.md#voidasyncfunction)_

_Defined in
[src/public-utils.ts:13](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/public-utils.ts#L13)_

Returns a async function that resolves after the specified time in
milliseconds.

This function can be used to configure a delay in the
`Before*Screenshot` hooks.

**Parameters:**

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| `millis` | number | the number of milliseconds |

**Returns:** _[VoidAsyncFunction](README.md#voidasyncfunction)_
