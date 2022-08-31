import styles from '../styles/Nav.module.scss';
import MiniDrawer from './MiniDrawer';

const Nav = () => {
	return (
		<nav className={styles.nav}>
			<MiniDrawer />
		</nav>
	);
};

export default Nav;
