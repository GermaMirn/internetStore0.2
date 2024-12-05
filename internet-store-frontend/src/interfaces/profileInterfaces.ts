export interface Profile {
	username: string;
	fullname: string;
	phoneNumber: string;
}


export interface ProfileMenuProps {
  onLogout: () => void;
  visible: boolean;
  toggleMenu: () => void;
}


export interface PersonActivitiesProps {
  username: string | null;
  onLogout: () => void;
  toggleMenu: () => void;
  menuVisible: boolean;
  navigate: (path: string) => void;
}
