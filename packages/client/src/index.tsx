import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";

import ReactDOM from "react-dom/client";
import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import { ToastContainer } from "react-toastify";

import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { bladedao } from "./mud/supportedChains";
import CreateGameModal from "./components/Modals/CreateGameModal";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);


// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then((result) => {
  // console.log("setup complete")
  // console.log(result)

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [bladedao],
    [publicProvider()],
  )
  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  })

  root.render(
    
      <WagmiConfig config={config}>
        <MUDProvider value={result}>
      <App />
      <CreateGameModal />
      <ToastContainer position="top-left" draggable={false} theme="dark" />
      </MUDProvider>
      </WagmiConfig>
    
  );
  //mountDevTools();
});
