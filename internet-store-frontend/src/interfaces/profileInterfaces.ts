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


export interface formatFIOProps {
	fio: string;
}


export interface PanelProfileInfoProfileMobileProps {
	fio?: string | null;
	username: string;
	phoneNumber?: string | null;
	edit: () => void;
}


export interface PanelElementProfileMobileProps {
	text: string;
	urlToSvg: string;
	navigateUrl?: string;
	move?: () => void;
}
