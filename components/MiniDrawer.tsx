import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ThemeContext } from '../hooks/ThemeProvider';
import { SocialContext } from '../hooks/SocialProvider';
import { supportedSocialList } from '../lib/defaults';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	AccountBox,
	DarkMode,
	Dashboard,
	Facebook,
	Instagram,
	LightMode,
	Login,
	Logout,
	Twitter,
} from '@mui/icons-material';
import Footer from './Footer';

const drawerWidth = 180;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

const socialIcons = {
	facebook: Facebook,
	twitter: Twitter,
	instagram: Instagram,
};

const MiniDrawer = ({ children }: React.ReactNode) => {
	const { data: user } = useSession();
	const { theme, toggleTheme } = useContext(ThemeContext);
	const { social, updateSocial } = useContext(SocialContext);
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleSocialChange = (value: string | null) => {
		// console.log(1);
		// console.log(value);
		// console.log(1);
		updateSocial(value);
		// router.query.social = value;
		// if (value) {
		// 	router.push(`/dashboard?social=${social}`);
		// } else {
		// 	router.push('/dashboard');
		// }
	};

	const handleThemeToggle = () => {
		toggleTheme();
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar open={open}>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={handleDrawerOpen}
						edge='start'
						sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
					>
						<MenuIcon />
					</IconButton>
					<Box sx={{ ml: 'auto' }}>
						<Link href='/'>
							<Typography variant='h4'>
								<Link href='/'>Social Media Dashboard</Link>
							</Typography>
						</Link>
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer anchor='left' variant='permanent' open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					{user ? (
						<ListItem disablePadding sx={{ display: 'block' }}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5,
								}}
								onClick={() => handleSocialChange(null)}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center',
									}}
								>
									<AccountBox />
								</ListItemIcon>
								<ListItemText
									primary={user?.user?.username}
									sx={{ opacity: open ? 1 : 0 }}
								/>
							</ListItemButton>
						</ListItem>
					) : (
						<ListItem disablePadding sx={{ display: 'block' }}>
							<ListItemButton
								component='a'
								href='/'
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5,
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center',
									}}
								>
									<Login />
								</ListItemIcon>
								<ListItemText
									primary='Sign In'
									sx={{ opacity: open ? 1 : 0 }}
								/>
							</ListItemButton>
						</ListItem>
					)}
					<ListItem disablePadding sx={{ display: 'block' }}>
						<ListItemButton
							component='a'
							href='/dashboard'
							sx={{
								minHeight: 48,
								justifyContent: open ? 'initial' : 'center',
								px: 2.5,
							}}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 3 : 'auto',
									justifyContent: 'center',
								}}
							>
								<Dashboard />
							</ListItemIcon>
							<ListItemText
								primary='Dashboard'
								sx={{ opacity: open ? 1 : 0 }}
							/>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding sx={{ display: 'block' }}>
						<ListItemButton
							sx={{
								minHeight: 48,
								justifyContent: open ? 'initial' : 'center',
								px: 2.5,
							}}
							onClick={handleThemeToggle}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 3 : 'auto',
									justifyContent: 'center',
								}}
							>
								{theme === 'dark' ? <DarkMode /> : <LightMode />}
							</ListItemIcon>
							<ListItemText primary='Mode' sx={{ opacity: open ? 1 : 0 }} />
						</ListItemButton>
					</ListItem>
					{user ? (
						<ListItem disablePadding sx={{ display: 'block' }}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5,
								}}
								onClick={() => signOut({ callbackUrl: '/' })}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center',
									}}
								>
									<Logout />
								</ListItemIcon>
								<ListItemText
									primary='Sign Out'
									sx={{ opacity: open ? 1 : 0 }}
								/>
							</ListItemButton>
						</ListItem>
					) : null}
				</List>
				<Divider />
				<List>
					{supportedSocialList.map((text) => {
						const SocialIcon = text ? socialIcons[text] : null;
						return (
							<ListItem key={text} disablePadding sx={{ display: 'block' }}>
								<ListItemButton
									sx={{
										backgroundColor: social == text ? 'lime' : 'white',
										minHeight: 48,
										justifyContent: open ? 'initial' : 'center',
										px: 2.5,
									}}
									onClick={() => handleSocialChange(text)}
								>
									<ListItemIcon
										sx={{
											minWidth: 0,
											mr: open ? 3 : 'auto',
											justifyContent: 'center',
										}}
									>
										<SocialIcon />
									</ListItemIcon>
									<ListItemText
										primary={text.charAt(0).toUpperCase() + text.slice(1)}
										sx={{ opacity: open ? 1 : 0 }}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
				<Footer />
			</Drawer>
			<main>{children}</main>
		</Box>
	);
};

export default MiniDrawer;
