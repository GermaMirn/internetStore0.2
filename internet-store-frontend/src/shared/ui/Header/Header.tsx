import styles from './Header.module.css'
import classNames from 'classnames';


export function Header() {
	return (
	<header>
		<div className={styles.mainDivOfHeader}>

			<div className={styles.logo}>
				<img src="/header/logo.svg" alt="" />
			</div>

			<div className={styles.searchBar}>

				<div className={styles.categories}>
					<img className={styles.categoriesSvg} src="/header/categories.svg" alt="" />

					<p className={styles.categoriesText}>Категории</p>
				</div>

				<div className={styles.searchButton}>
					<img src="/header/search.svg" alt="" />
				</div>

			</div>

			<div className={styles.personActivities}>

				<div className={classNames(styles.favorites, styles.svgOfPersonActivities)}>
					<img className={styles.divForSvgOfPersonActivities} src="/header/favorites.svg" alt="" />

					<p className={styles.textOfPersonActivities}>Избранные</p>
				</div>

				<div className={classNames(styles.shoppingCart, styles.svgOfPersonActivities)}>
					<img  className={styles.divForSvgOfPersonActivities} src="/header/shoppingCart.svg" alt="" />

					<p className={classNames(styles.textOfPersonActivities, styles.testForShoppingCart)}>Корзина</p>
				</div>

				<div className={classNames(styles.profile, styles.svgOfPersonActivities)}>

					<img className={styles.divForSvgOfPersonActivities} src="/header/profile.svg" alt="" />

					<p className={styles.textOfPersonActivities}>Профиль</p>
				</div>

			</div>

		</div>
	</header>
	)
}
