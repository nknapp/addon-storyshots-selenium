[@knappi/addon-storyshots-selenium](README.md)

# @knappi/addon-storyshots-selenium

## Index

### Interfaces

- [BasicHookOptions](interfaces/basichookoptions.md)
- [BrowserSpecification](interfaces/browserspecification.md)
- [LifeCycleMethod](interfaces/lifecyclemethod.md)
- [OptionalImageSnapshotOptions](interfaces/optionalimagesnapshotoptions.md)
- [RequiredImageSnapshotOptions](interfaces/requiredimagesnapshotoptions.md)
- [StoryParameters](interfaces/storyparameters.md)
- [StorybookContext](interfaces/storybookcontext.md)
- [StorybookStory](interfaces/storybookstory.md)
- [TestMethod](interfaces/testmethod.md)
- [WithImage](interfaces/withimage.md)
- [WithSize](interfaces/withsize.md)

### Type aliases

- [AfterEachScreenshotFunction](README.md#aftereachscreenshotfunction)
- [BeforeEachScreenshotFunction](README.md#beforeeachscreenshotfunction)
- [BeforeFirstScreenshotFunction](README.md#beforefirstscreenshotfunction)
- [GetMatchOptionsFunction](README.md#getmatchoptionsfunction)
- [GetMatchOptionsOptions](README.md#getmatchoptionsoptions)
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
[src/types.ts:51](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L51)_

#### Type declaration:

▸ (`options`: [BasicHookOptions](interfaces/basichookoptions.md) &
[WithImage](interfaces/withimage.md) &
[WithSize](interfaces/withsize.md)): _Promise‹void›_

**Parameters:**

| Name      | Type                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `options` | [BasicHookOptions](interfaces/basichookoptions.md) & [WithImage](interfaces/withimage.md) & [WithSize](interfaces/withsize.md) |

---

### BeforeEachScreenshotFunction

Ƭ **BeforeEachScreenshotFunction**: _function_

_Defined in
[src/types.ts:42](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L42)_

#### Type declaration:

▸ (`driver`: WebDriver, `options`:
[BasicHookOptions](interfaces/basichookoptions.md) &
[WithSize](interfaces/withsize.md)): _Promise‹void›_

**Parameters:**

| Name      | Type                                                                                    |
| --------- | --------------------------------------------------------------------------------------- |
| `driver`  | WebDriver                                                                               |
| `options` | [BasicHookOptions](interfaces/basichookoptions.md) & [WithSize](interfaces/withsize.md) |

---

### BeforeFirstScreenshotFunction

Ƭ **BeforeFirstScreenshotFunction**: _function_

_Defined in
[src/types.ts:33](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L33)_

#### Type declaration:

▸ (`driver`: WebDriver, `options`:
[BasicHookOptions](interfaces/basichookoptions.md)): _Promise‹void›_

**Parameters:**

| Name      | Type                                               |
| --------- | -------------------------------------------------- |
| `driver`  | WebDriver                                          |
| `options` | [BasicHookOptions](interfaces/basichookoptions.md) |

---

### GetMatchOptionsFunction

Ƭ **GetMatchOptionsFunction**: _function_

_Defined in
[src/types.ts:57](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L57)_

#### Type declaration:

▸ (`options`:
[GetMatchOptionsOptions](README.md#getmatchoptionsoptions)):
_Promise‹Partial‹MatchImageSnapshotOptions›› |
Partial‹MatchImageSnapshotOptions›_

**Parameters:**

| Name      | Type                                                       |
| --------- | ---------------------------------------------------------- |
| `options` | [GetMatchOptionsOptions](README.md#getmatchoptionsoptions) |

---

### GetMatchOptionsOptions

Ƭ **GetMatchOptionsOptions**:
_[BasicHookOptions](interfaces/basichookoptions.md) &
[WithSize](interfaces/withsize.md)_

_Defined in
[src/types.ts:55](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L55)_

---

### ImageSnapshotOptions

Ƭ **ImageSnapshotOptions**:
_Partial‹[OptionalImageSnapshotOptions](interfaces/optionalimagesnapshotoptions.md)›
&
[RequiredImageSnapshotOptions](interfaces/requiredimagesnapshotoptions.md)_

_Defined in
[src/types.ts:105](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L105)_

---

### InternalImageSnapshotOptions

Ƭ **InternalImageSnapshotOptions**:
_[OptionalImageSnapshotOptions](interfaces/optionalimagesnapshotoptions.md)
&
[RequiredImageSnapshotOptions](interfaces/requiredimagesnapshotoptions.md)_

_Defined in
[src/types.ts:99](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L99)_

---

### VoidAsyncFunction

Ƭ **VoidAsyncFunction**: _function_

_Defined in
[src/public-utils.ts:4](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/public-utils.ts#L4)_

A function that returns a void-promise

#### Type declaration:

▸ (): _Promise‹void›_

---

### WidthXHeightString

Ƭ **WidthXHeightString**: _string_

_Defined in
[src/types.ts:25](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/types.ts#L25)_

String of the form "1000x800"

## Variables

### `Const` sectionDebug

• **sectionDebug**: _SectionDebug_ =
createSectionDebug(createDebug("addon-storyshots-selenium:index-trace"))

_Defined in
[src/index.ts:18](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.ts#L18)_

## Functions

### doNothing

▸ **doNothing**(): _[VoidAsyncFunction](README.md#voidasyncfunction)_

_Defined in
[src/public-utils.ts:20](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/public-utils.ts#L20)_

returns an async function that resolves immediately, without doing
anything.

**Returns:** _[VoidAsyncFunction](README.md#voidasyncfunction)_

---

### imageSnapshot

▸ **imageSnapshot**(`options`:
[ImageSnapshotOptions](README.md#imagesnapshotoptions)):
_[TestMethod](interfaces/testmethod.md)_

_Defined in
[src/index.ts:33](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.ts#L33)_

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
[src/public-utils.ts:13](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/public-utils.ts#L13)_

Returns a async function that resolves after the specified time in
milliseconds.

This function can be used to configure a delay in the
`Before*Screenshot` hooks.

**Parameters:**

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| `millis` | number | the number of milliseconds |

**Returns:** _[VoidAsyncFunction](README.md#voidasyncfunction)_
