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
const p = new Presence('https://prsc.yomo.dev', {
  url: process.env.NEXT_PUBLIC_PRESENCE_URL,
  publicKey: process.env.NEXT_PUBLIC_PRESENCE_PUBLIC_KEY,
  id,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  debug: true,
});

p.on('connected', () => {
    console.log('Connected to server: ', p.host);
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
