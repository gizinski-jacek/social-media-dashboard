import { Link } from '@mui/material';
import styles from '../styles/Nav.module.scss';

const Nav = () => {
	return (
		<div className={styles.nav}>
			<div className={styles.left}>
				<Link href='/'>
					<h1>Social Media Dashboard</h1>
				</Link>
			</div>
			<div className={styles.right}>
				<div className={styles.account}>Acc</div>
				<button className={styles.toggle_mode}>Toggle D/L Mode</button>
			</div>
		</div>
	);
};

export default Nav;
