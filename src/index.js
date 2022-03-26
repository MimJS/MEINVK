import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import { App } from "./App";
import { ConfigProvider } from "@vkontakte/vkui";

// start VK Bridge
bridge.send("VKWebAppInit");

ReactDOM.render(
  <ConfigProvider appearance="light">
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);
