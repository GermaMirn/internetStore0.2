import styles from './WelcomePage.module.css'
import SearchProductsPage from '../searchProducts/ui/SearchProductsPage';


function WelcomePage() {
	return (
		<div>
			<div className={styles.mainDivWelcome}>
				<div className={styles.divWelcomeHeaderText}>
					<img className={styles.dotImg} src="/product/dot.svg" alt="dot" />
					<h2>Добро пожаловать</h2>
				</div>
				<hr className={styles.hr} />

				<h4 className={styles.welcomeText}>
				Это магазин автоаксессуаров — у нас есть всё, чтобы твоя машина исправно ехала, выглядела круче и ломалась реже. Заходи, выбирай, заказывай
				</h4>
			</div>

			<SearchProductsPage />
		</div>
	)
}


export default WelcomePage;
