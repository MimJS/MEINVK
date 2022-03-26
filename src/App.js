import {
  AdaptivityProvider,
  Alert,
  AppRoot,
  Avatar,
  Button,
  IconButton,
  Input,
  Panel,
  Snackbar,
  Spinner,
  View,
} from "@vkontakte/vkui";
import "./styles/index.scss";
import "@vkontakte/vkui/dist/vkui.css";
import { useEffect, useState } from "react";
import { Icon20CopyOutline } from "@vkontakte/icons";
import { Icon20QrCodeOutline } from "@vkontakte/icons";
import { Icon56CancelCircleOutline } from "@vkontakte/icons";
import { OkIcon, TgIcon, TwitterIcon } from "./icons";
import { Icon48WritebarDone } from "@vkontakte/icons";
import vkQr from "@vkontakte/vk-qr";
import bridge from "@vkontakte/vk-bridge";

export const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [showError, setShowError] = useState(false);
  const [popout, setPopout] = useState(null);
  const [userData, setUserData] = useState(null);
  const [domain, setDomain] = useState(null);
  const [okUrl, setOkUrl] = useState(null);
  const shareText = `Я ВКонтакте`;
  const encodedShareText = encodeURIComponent(shareText);
  const url = `https://vk.com/${domain}`;
  const encodedUrl = encodeURIComponent(url);
  const tgShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedShareText}`;
  const twShareUrl = `https://twitter.com/share?text=${encodedShareText}&url=${url}`;

  const okAttachment = {
    media: [
      {
        type: "text",
        text: shareText,
      },
      {
        type: "link",
        url: url,
      },
    ],
  };
  const okAttachmentPrepared = JSON.stringify(okAttachment);

  useEffect(() => {
    const getOkUrl = async (token) => {};
    const getDomain = async (id) => {
      const token = await bridge.send("VKWebAppGetAuthToken", {
        app_id: 8113115,
        scope: "",
      });
      if (token.access_token) {
        const userDomain = await bridge.send("VKWebAppCallAPIMethod", {
          method: "users.get",
          request_id: "requestToken",
          params: {
            user_ids: id,
            v: "5.121",
            access_token: token.access_token,
            fields: "screen_name",
          },
        });
        if (userDomain.response) {
          setDomain(userDomain.response[0].screen_name);
          setIsOpen(true);
        } else {
          setIsOpen(true);
          setShowError(true);
          return;
        }
        //getOkUrl(token.access_token);
      } else {
        setShowError(true);
        return;
      }
    };
    const getData = async () => {
      const user = await bridge.send("VKWebAppGetUserInfo");
      setUserData(user);
      setDomain(`id${user.id}`);
      getDomain(user.id);
    };
    getData();
  }, []);

  const copyText = () => {
    bridge
      .send("VKWebAppCopyText", { text: url })
      .then(() => {
        setShowCopy(true);
        return;
      })
      .catch((e) => {
        setShowError(true);
        return;
      });
  };
  const closeCopySnack = () => {
    setShowCopy(false);
  };
  const closeErrorSnack = () => {
    setShowError(false);
  };

  const openQr = () => {
    const qrSvg = vkQr.createQR(url, {
      qrSize: 150,
      isShowLogo: true,
    });
    setPopout(
      <Alert onClose={() => setPopout(null)} className="AlertQR">
        <div
          className="QrCode"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        ></div>
        <span className="title">QR код для перехода на мою страницу ВК</span>
      </Alert>
    );
  };

  return (
    <AppRoot>
      <AdaptivityProvider hasMouse={false}>
        <View id="Main" activePanel="Main--panel" popout={popout}>
          <Panel id="Main--panel">
            <div
              className={`Profile__Wrapper ${isOpen ? "Profile--open" : ""}`}
            >
              <div className="Profile__Block Block--Info">
                <Avatar
                  size={72}
                  src={
                    "https://sun1-97.userapi.com/s/v1/ig2/MkXhBsO8pHDquYG7t4oO7u9g2eLz7YesJEOD6ZuaRMmtD3psZydksiiGasV_rsetbZHTQWYZdcgfnb0x5YyFN3oO.jpg?size=200x200&quality=96&crop=66,66,524,524&ava=1"
                  }
                  onClick={() => {
                    if (isOpen) {
                      setIsOpen(false);
                    } else {
                      setIsOpen(true);
                    }
                  }}
                />
                <span className="Block--Description">Михаил Матеевский</span>
              </div>
              <div className="Profile__Block Block--Url">
                <span className="Block--Description">Ссылка на меня:</span>
                <Input
                  readOnly
                  value={url}
                  after={
                    <IconButton onClick={openQr}>
                      <Icon20QrCodeOutline />
                    </IconButton>
                  }
                />
                <Button
                  mode="outline"
                  appearance="accent"
                  before={<Icon20CopyOutline width={16} height={16} />}
                  size="m"
                  onClick={copyText}
                >
                  Скопировать
                </Button>
              </div>
              <div className="Profile__Block Block--share">
                <span className="Block--Description">
                  Поделиться ссылкой в:
                </span>
                <div className="Block--SocialList">
                  <IconButton href={tgShareUrl} target="_blank">
                    <TgIcon />
                  </IconButton>
                  <IconButton href={twShareUrl} target="_blank">
                    <TwitterIcon />
                  </IconButton>
                  {/*
                  <IconButton href={okUrl || ""} target="_blank">
                    <OkIcon />
                  </IconButton>
                  */}
                </div>
              </div>
              {!isOpen ? (
                <div className="Profile__Loading">
                  <Spinner size="regular" />
                  <span className="Loading__Description">
                    Загрузка данных...
                  </span>
                </div>
              ) : null}
            </div>
            {showCopy ? (
              <Snackbar
                onClose={closeCopySnack}
                duration={3000}
                before={
                  <Icon48WritebarDone width={36} height={36} fill="#4BB34B" />
                }
              >
                Ссылка скопирована
              </Snackbar>
            ) : null}
            {showError ? (
              <Snackbar
                onClose={closeErrorSnack}
                duration={3000}
                before={
                  <Icon56CancelCircleOutline
                    width={36}
                    height={36}
                    fill="#EB4250"
                  />
                }
              >
                Произошла ошибка
              </Snackbar>
            ) : null}
          </Panel>
        </View>
      </AdaptivityProvider>
    </AppRoot>
  );
};
