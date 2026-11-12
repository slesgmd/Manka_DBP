import LoadingView from "../components/LoadingView";
import ScreenBackground from "../components/ScreenBackground";

export default function LoadingScreen() {
  return (
    <ScreenBackground edges={["top", "bottom"]}>
      <LoadingView label="Abriendo Manka…" />
    </ScreenBackground>
  );
}
