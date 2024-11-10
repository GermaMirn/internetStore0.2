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
