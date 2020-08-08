[@knappi/addon-storyshots-selenium](../README.md) ›
[TestMethod](testmethod.md)

# Interface: TestMethod

The result-type of the "imageSnapshot" method.

## Hierarchy

- **TestMethod**

## Callable

▸ (`story`: any, `context`: any, `renderTree`: RenderTree, `options?`:
any): _any_

_Defined in
[src/types.ts:13](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L13)_

The result-type of the "imageSnapshot" method.

**Parameters:**

| Name         | Type       |
| ------------ | ---------- |
| `story`      | any        |
| `context`    | any        |
| `renderTree` | RenderTree |
| `options?`   | any        |

**Returns:** _any_

## Index

### Properties

- [afterAll](testmethod.md#optional-afterall)
- [beforeAll](testmethod.md#optional-beforeall)
- [timeout](testmethod.md#optional-timeout)

## Properties

### `Optional` afterAll

• **afterAll**? : _[LifeCycleMethod](lifecyclemethod.md)_

_Defined in
[src/types.ts:16](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L16)_

---

### `Optional` beforeAll

• **beforeAll**? : _[LifeCycleMethod](lifecyclemethod.md)_

_Defined in
[src/types.ts:15](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L15)_

---

### `Optional` timeout

• **timeout**? : _number_

_Defined in
[src/types.ts:17](https://github.com/nknapp/addons-storyshots-selenium/blob/fbd4145/src/types.ts#L17)_
