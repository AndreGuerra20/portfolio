export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I design secure and scalable architectures for blockchain, IoT and AI systems ",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "Experience collaborating in research and technical teams across academia and industry.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Security-first mindset with a strong foundation in threat modeling and risk analysis.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Currently researching secure BLE communication and Self-Sovereign Identity (SSI) credential management.",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Interested in secure system design, blockchain or IoT research collaboration?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "Security Analysis of Bluetooth Low Energy in IoT Devices",
    des: "Experimental evaluation of BLE security modes using ESP32 devices. Includes AES-GCM application-layer encryption, packet sniffing with nRF52840, performance benchmarking and attack surface analysis.",
    img: "/ble_security_analysis.svg",
    iconLists: ["/Bluetooth.svg", "/esp32.svg", "/Wireshark.svg", "/C.svg", "/C++.svg"],
    link: "https://github.com/AndreGuerra20/Security-Analysis-of-Bluetooth-Low-Energy-Communication-in-IOT-Devices",
  },
  {
    id: 2,
    title: "Pmei",
    des: "Enterprise platform for monitoring smart packaging equipped with sensors, enabling real-time telemetry processing and order status visibility across logistics and operations",
    img: "/projetoDAE.png",
    iconLists: ["/java.svg", "/js.svg", "/vue.svg", "/tail.svg", "/postgresql.svg", "/dock.svg"],
    link: "https://github.com/AndreGuerra20/ProjetoDAE",
  },
  {
    id: 3,
    title: "Memory Game",
    des: "Multiplayer memory game built with Vue, featuring a grid of cards that players flip to find matching pairs. Backend implemented with Laravel, providing user authentication and game state management.",
    img: "/projetoDAD.png",
    iconLists: ["/Laravel.svg", "/php.svg", "/vue.svg", "/js.svg", "/tail.svg"],
    link: "https://github.com/ddinis-pt/DAD",
  },
  {
    id: 4,
    title: "SOMIOD",
    des: "Service Oriented Middleware for Interoperability and Open Data ",
    img: "/somiod.png",
    iconLists: ["/c_sharp.svg", "/dotnet.svg", "mqtt.png", "ms_sql_server.svg"],
    link: "https://github.com/ddinis-pt/IS",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
  },
  {
    id: 2,
    img: "/twit.svg",
  },
  {
    id: 3,
    img: "/link.svg",
  },
];