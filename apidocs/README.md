[@knappi/addon-storyshots-selenium](README.md)

# @knappi/addon-storyshots-selenium

## Index

### Interfaces

- [BasicHookOptions](interfaces/basichookoptions.md)
- [BrowserSpecification](interfaces/browserspecification.md)
- [LifeCycleMethod](interfaces/lifecyclemethod.md)
- [OptionalImageSnapshotOptions](interfaces/optionalimagesnapshotoptions.md)
- [RequiredImageSnapshotOptions](interfaces/requiredimagesnapshotoptions.md)
- [ReverseTunnelOptions](interfaces/reversetunneloptions.md)
- [StaticFileServer](interfaces/staticfileserver.md)
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

- [REMOTE_TUNNEL_PORT](README.md#const-remote_tunnel_port)
- [STORYBOOK_PORT](README.md#const-storybook_port)
- [browserstackTunnel](README.md#const-browserstacktunnel)
- [createBrowserMock](README.md#const-createbrowsermock)
- [createSnapshotterMock](README.md#const-createsnapshottermock)
- [debug](README.md#const-debug)
- [sectionDebug](README.md#const-sectiondebug)
- [server](README.md#const-server)
- [tunnel](README.md#const-tunnel)

### Functions

- [Boundaries](README.md#const-boundaries)
- [browserInfo](README.md#const-browserinfo)
- [doNothing](README.md#donothing)
- [getActualSnapshotterOptions](README.md#getactualsnapshotteroptions)
- [imageSnapshot](README.md#imagesnapshot)
- [responsive](README.md#const-responsive)
- [reverseTunnel](README.md#reversetunnel)
- [runTestMethodWithLifeCycle](README.md#runtestmethodwithlifecycle)
- [storybookStaticServer](README.md#storybookstaticserver)
- [waitMillis](README.md#waitmillis)
- [withEmoji](README.md#const-withemoji)
- [withText](README.md#const-withtext)

### Object literals

- [CHROME](README.md#const-chrome)
- [CONTEXT](README.md#const-context)
- [FIREFOX](README.md#const-firefox)

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

### `Const` REMOTE_TUNNEL_PORT

• **REMOTE_TUNNEL_PORT**: _9009_ = 9009

_Defined in
[integration-test/docker-selenium.test.ts:6](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/docker-selenium.test.ts#L6)_

---

### `Const` STORYBOOK_PORT

• **STORYBOOK_PORT**: _9009_ = 9009

_Defined in
[integration-test/docker-selenium.test.ts:7](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/docker-selenium.test.ts#L7)_

---

### `Const` browserstackTunnel

• **browserstackTunnel**: _Local‹›_ = new browserstack.Local()

_Defined in
[integration-test/test-utils/browserstack-tunnel.ts:5](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/test-utils/browserstack-tunnel.ts#L5)_

---

### `Const` createBrowserMock

• **createBrowserMock**: _MockInstance‹Browser, [string,
[BrowserSpecification](interfaces/browserspecification.md)]› &
createBrowser_ = createBrowser as
jest.MockedFunction<typeof createBrowser>

_Defined in
[src/index.test.ts:9](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L9)_

---

### `Const` createSnapshotterMock

• **createSnapshotterMock**: _MockInstance‹Snapshotter,
[SnapshotterOptions]› & createSnapshotter_ = createSnapshotter as
jest.MockedFunction<typeof createSnapshotter>

_Defined in
[src/index.test.ts:12](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L12)_

---

### `Const` debug

• **debug**: _Debugger_ =
createDebug("addon-storyshot-selenium:browserstack-tunnel")

_Defined in
[integration-test/test-utils/browserstack-tunnel.ts:4](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/test-utils/browserstack-tunnel.ts#L4)_

---

### `Const` sectionDebug

• **sectionDebug**: _SectionDebug_ =
createSectionDebug(createDebug("addon-storyshots-selenium:index-trace"))

_Defined in
[src/index.ts:18](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.ts#L18)_

---

### `Const` server

• **server**: _[StaticFileServer](interfaces/staticfileserver.md)_ =
storybookStaticServer(STORYBOOK_PORT)

_Defined in
[integration-test/docker-selenium.test.ts:28](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/docker-selenium.test.ts#L28)_

---

### `Const` tunnel

• **tunnel**: _ChildService‹›_ = reverseTunnel({ host:
process.env.SELENIUM_HOST || "localhost", tunnelSpec:
`R:${REMOTE_TUNNEL_PORT}:localhost:${STORYBOOK_PORT}`, })

_Defined in
[integration-test/test-utils/browserstack-tunnel.ts:7](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/test-utils/browserstack-tunnel.ts#L7)_

_Defined in
[integration-test/docker-selenium.test.ts:20](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/docker-selenium.test.ts#L20)_

## Functions

### `Const` Boundaries

▸ **Boundaries**(): _HTMLElement_

_Defined in
[integration-test/stories/image-boundaries.stories.ts:10](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/stories/image-boundaries.stories.ts#L10)_

**Returns:** _HTMLElement_

---

### `Const` browserInfo

▸ **browserInfo**(): _HTMLElement_

_Defined in
[integration-test/stories/button.stories.ts:21](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/stories/button.stories.ts#L21)_

**Returns:** _HTMLElement_

---

### doNothing

▸ **doNothing**(): _[VoidAsyncFunction](README.md#voidasyncfunction)_

_Defined in
[src/public-utils.ts:20](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/public-utils.ts#L20)_

returns an async function that resolves immediately, without doing
anything.

**Returns:** _[VoidAsyncFunction](README.md#voidasyncfunction)_

---

### getActualSnapshotterOptions

▸ **getActualSnapshotterOptions**(`nonRequiredOptions`:
Partial‹[ImageSnapshotOptions](README.md#imagesnapshotoptions)›,
`context`: [StorybookContext](interfaces/storybookcontext.md)):
_Promise‹SnapshotterOptions›_

_Defined in
[src/index.test.ts:254](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L254)_

**Parameters:**

| Name                 | Type                                                            |
| -------------------- | --------------------------------------------------------------- |
| `nonRequiredOptions` | Partial‹[ImageSnapshotOptions](README.md#imagesnapshotoptions)› |
| `context`            | [StorybookContext](interfaces/storybookcontext.md)              |

**Returns:** _Promise‹SnapshotterOptions›_

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

### `Const` responsive

▸ **responsive**(): _HTMLElement_

_Defined in
[integration-test/stories/button.stories.ts:38](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/stories/button.stories.ts#L38)_

**Returns:** _HTMLElement_

---

### reverseTunnel

▸ **reverseTunnel**(`__namedParameters`: object): _ChildService_

_Defined in
[integration-test/test-utils/reverse-tunnel.ts:9](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/test-utils/reverse-tunnel.ts#L9)_

**Parameters:**

▪ **\_\_namedParameters**: _object_

| Name         | Type   |
| ------------ | ------ |
| `host`       | string |
| `tunnelSpec` | string |

**Returns:** _ChildService_

---

### runTestMethodWithLifeCycle

▸ **runTestMethodWithLifeCycle**(`options`:
[ImageSnapshotOptions](README.md#imagesnapshotoptions), `context`:
[StorybookContext](interfaces/storybookcontext.md)): _Promise‹void›_

_Defined in
[src/index.test.ts:240](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L240)_

**Parameters:**

| Name      | Type                                                   |
| --------- | ------------------------------------------------------ |
| `options` | [ImageSnapshotOptions](README.md#imagesnapshotoptions) |
| `context` | [StorybookContext](interfaces/storybookcontext.md)     |

**Returns:** _Promise‹void›_

---

### storybookStaticServer

▸ **storybookStaticServer**(`listenPort`: number):
_[StaticFileServer](interfaces/staticfileserver.md)_

_Defined in
[integration-test/test-utils/server.ts:9](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/test-utils/server.ts#L9)_

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `listenPort` | number |

**Returns:** _[StaticFileServer](interfaces/staticfileserver.md)_

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

---

### `Const` withEmoji

▸ **withEmoji**(): _HTMLElement_

_Defined in
[integration-test/stories/button.stories.ts:14](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/stories/button.stories.ts#L14)_

**Returns:** _HTMLElement_

---

### `Const` withText

▸ **withText**(): _string_

_Defined in
[integration-test/stories/button.stories.ts:12](https://github.com/nknapp/addons-storyshots-selenium/blob/master/integration-test/stories/button.stories.ts#L12)_

**Returns:** _string_

## Object literals

### `Const` CHROME

### ▪ **CHROME**: _object_

_Defined in
[src/index.test.ts:26](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L26)_

### id

• **id**: _string_ = "chrome"

_Defined in
[src/index.test.ts:27](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L27)_

▪ **capabilities**: _object_

_Defined in
[src/index.test.ts:28](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L28)_

- **browserName**: _string_ = "chrome"

---

### `Const` CONTEXT

### ▪ **CONTEXT**: _object_

_Defined in
[src/index.test.ts:33](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L33)_

### kind

• **kind**: _string_ = "a-kind"

_Defined in
[src/index.test.ts:33](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L33)_

▪ **story**: _object_

_Defined in
[src/index.test.ts:33](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L33)_

- **id**: _string_ = "a-story"

---

### `Const` FIREFOX

### ▪ **FIREFOX**: _object_

_Defined in
[src/index.test.ts:20](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L20)_

### id

• **id**: _string_ = "firefox"

_Defined in
[src/index.test.ts:21](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L21)_

▪ **capabilities**: _object_

_Defined in
[src/index.test.ts:22](https://github.com/nknapp/addons-storyshots-selenium/blob/master/src/index.test.ts#L22)_

- **browserName**: _string_ = "firefox"
