## GroupHug

![](https://badgen.net/npm/v/@yomo/group-hug-react)

Live collaborator avatars for multiplayer web apps

[Online Demo](https://allegrocloud.io/preview/clewfjysp0008osvwuina6qnf)

## 🥷🏼 Usage

Install with npm:

```
$ npm i --save @yomo/group-hug-react
```

Create a [Presence](https://github.com/yomorun/presencejs) instance

```js
import Presence from '@yomo/presence';

// create an instance.
const presencePromise = new Presence('https://prsc.yomo.dev', {
  publicKey: process.env.NEXT_PUBLIC_PRESENCE_PUBLIC_KEY,
  id,
  debug: true,
});
```

Add `<GroupHug />` to pages:

```js
const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div>
      <GroupHug
        presence={presence}
        id={id}
        avatar={avatar}
        name={randomName}
        darkMode={darkMode}
      />
    </div>
  );
};
```

## Self-hosting

see [prscd](https://github.com/yomorun/presencejs/tree/main/prscd#readme)

## License

The [MIT License](./LICENSE).
