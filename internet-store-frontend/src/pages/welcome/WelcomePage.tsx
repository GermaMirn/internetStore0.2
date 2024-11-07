import styles from './WelcomePage.module.css'
import SearchProductsPage from '../searchProducts/ui/SearchProductsPage';


function WelcomePage() {
	return (
		<div>
			<div className={styles.mainDivWelcome}>
				<h2 className={styles.welcomeHeaderText}>Some welcome words</h2>
				<h4 className={styles.welcomeText}>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima molestiae quaerat ab dignissimos laudantium. Aspernatur sint dignissimos est exercitationem ea neque doloribus consectetur laudantium quae, dolore, impedit in libero suscipit.
					Voluptas minus veniam, quidem debitis delectus voluptatibus unde sunt velit. Voluptate aperiam accusantium repellat omnis eos! Consectetur esse quo qui accusantium voluptatibus ea facilis! Illum iusto ut tempore voluptatibus fugit.
					Perspiciatis reprehenderit numquam, iure eligendi vel recusandae a quam consectetur magni quasi assumenda facere ipsam porro ea corrupti cumque eius est asperiores doloribus cum. Delectus deleniti nulla quo dolorum qui?
				</h4>
			</div>

			<SearchProductsPage />
		</div>
	)
}


export default WelcomePage;
