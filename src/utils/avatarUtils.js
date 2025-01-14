// src/utils/avatarUtils.js
import cowledIcon from "../assets/avatars/cowled.svg";
import femaleVampireIcon from "../assets/avatars/femaleVampire.svg";
import hoodIcon from "../assets/avatars/hood.svg";
import overlordIcon from "../assets/avatars/overlord.svg";
import quickManIcon from "../assets/avatars/quickMan.svg";
import visoredHelmIcon from "../assets/avatars/visoredHelm.svg";
import wizardIcon from "../assets/avatars/wizard.svg";
import womanElfIcon from "../assets/avatars/womanElf.svg";
import witchIcon from "../assets/avatars/witch.svg";

export const AVATARS = [
  { id: "cowled", name: "Cowled", image: cowledIcon },
  { id: "hood", name: "Hood", image: hoodIcon, type: "stealth" },
  { id: "wizard", name: "Wizard", image: wizardIcon, type: "magic" },
  {
    id: "femaleVampire",
    name: "Female Vampire",
    image: femaleVampireIcon,
    type: "evil",
  },
  { id: "femaleElf", name: "Female Elf", image: womanElfIcon, type: "nature" },
  { id: "witch", name: "Witch", image: witchIcon, type: "magic" },
  { id: "overlord", name: "Overlord", image: overlordIcon, type: "evil" },
  {
    id: "visoredHelm",
    name: "Visored Helm",
    image: visoredHelmIcon,
    type: "warrior",
  },
  { id: "quickMan", name: "Quick Man", image: quickManIcon, type: "warrior" },
];

export const AVATAR_IMAGES = {
  cowled: cowledIcon,
  femaleVampire: femaleVampireIcon,
  hood: hoodIcon,
  overlord: overlordIcon,
  quickMan: quickManIcon,
  visoredHelm: visoredHelmIcon,
  wizard: wizardIcon,
  womanElf: womanElfIcon,
  witch: witchIcon,
};

export const getAvatarImage = (avatarId) => {
  return AVATAR_IMAGES[avatarId] || AVATAR_IMAGES.cowled; // fallback to cowled if not found
};
