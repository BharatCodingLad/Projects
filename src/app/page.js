import Image from "next/image";
import Chat from "./components/chat";

export const metadata = {
  title: '✨ Princess Chat',
  description: 'Your magical AI chat companion',
};

export default function Home() {
  return (
    <main>
      <Chat />
    </main>
  );
}
