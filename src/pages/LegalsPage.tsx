import { useEffect } from "react";
import { PublicFooter } from "@/components/landingPage/PublicFooter";
import { PublicHeader } from "@/components/landingPage/PublicHeader";

export function LegalsPage() {
	useEffect(() => {
		document.title = "La Pince – Mentions légales";
	}, []);
	return (
		<div className="min-h-screen w-full">
			<PublicHeader />

			<main>
				<section className="mx-auto w-full max-w-3xl px-10 py-20 text-center sm:px-6 lg:px-8">
					<h2 className="text-3xl font-semibold tracking-tight">
						Politique de confidentialité
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Dernière mise à jour : 28/05/2026
					</p>
					<article className="text-justify">
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							1. Introduction
						</h3>
						<p>
							Bienvenue sur <b>La Pince</b>.
						</p>
						<p>
							La protection de vos données personnelles est importante pour
							nous. Cette politique de confidentialité explique quelles données
							sont collectées, pourquoi elles le sont, comment elles sont
							utilisées et quels sont vos droits. En utilisant l’application,
							vous acceptez les pratiques décrites dans cette politique.
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							2. Responsable du traitement
						</h3>
						<p>
							Le responsable du traitement des données est : <b>La Pince</b>
						</p>
						<p>
							Projet pédagogique réalisé dans le cadre de la formation CDA de
							O’clock.
						</p>
						<p>Contact : [EMAIL_DE_CONTACT] </p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							3. Données collectées
						</h3>
						<p>
							Nous collectons uniquement les données nécessaires au
							fonctionnement de l’application.
						</p>
						<h4 className="font-semibold tracking-tight py-2 pt-4">
							Données de compte
						</h4>
						<p>Lors de l’inscription :</p>
						<ul className="list-disc px-4">
							<li> Nom ou pseudo </li>
							<li> Adresse email</li>
							<li> Mot de passe chiffré</li>
						</ul>
						<p className="pt-2">
							Les mots de passe ne sont jamais stockés en clair.
						</p>
						<h4 className="font-semibold tracking-tight py-2 pt-4">
							Données liées à l’utilisation de l’application
						</h4>
						<p>Dans le cadre du fonctionnement des projets et dépenses :</p>
						<ul className="list-disc px-4">
							<li> Projets créés </li>
							<li> Participants</li>
							<li> Opérations financières </li>
							<li> Budgets</li>
							<li> Alertes </li>
							<li> Catégories utilisées</li>
						</ul>
						<h4 className="font-semibold tracking-tight py-2 pt-4">
							Données techniques
						</h4>
						<p>
							Certaines données techniques peuvent être enregistrées
							automatiquement :
						</p>
						<ul className="list-disc px-4">
							<li> Logs techniques </li>
							<li> Erreurs serveur </li>
							<li> Date et heure de connexion </li>
							<li> Adresse IP temporairement dans les logs de sécurité </li>
						</ul>
						<p className="pt-2">Ces données servent uniquement à : </p>
						<ul className="list-disc px-4">
							<li> Sécuriser l’application </li>
							<li> Prévenir les abus </li>
							<li> Diagnostiquer les erreurs techniques </li>
						</ul>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							4. Finalités du traitement
						</h3>
						<p>Vos données sont utilisées uniquement pour :</p>
						<ul className="list-disc px-4">
							<li> Créer et gérer votre compte</li>
							<li> Permettre l’utilisation de l’application</li>
							<li> Calculer les répartitions de dépenses </li>
							<li> Générer des alertes budgétaires</li>
							<li> Sécuriser l’API et prévenir les abus</li>
							<li> Améliorer la stabilité et la maintenance du service</li>
						</ul>
						<p className="pt-2">
							Aucune donnée n’est vendue ni utilisée à des fins publicitaires.
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							5. Base légale du traitement
						</h3>
						<p>Le traitement des données repose sur : </p>
						<ul className="list-disc px-4">
							<li> L’exécution du service</li>
							demandé par l’utilisateur
							<li>
								L’intérêt légitime lié à la sécurité et à la maintenance de
								l’application
							</li>
						</ul>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							6. Durée de conservation
						</h3>
						<p>Les données sont conservées :</p>
						<ul className="list-disc px-4">
							<li> Tant que le compte utilisateur est actif</li>
							<li> Jusqu’à suppression du compte par l’utilisateur </li>
							<li>
								Ou pendant une durée raisonnable nécessaire à des obligations
								techniques ou légales
							</li>
						</ul>
						<p className="pt-2">
							Les logs techniques sont conservés temporairement et supprimés
							régulièrement.
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							7. Sécurité des données
						</h3>
						<p>Nous mettons en place plusieurs mesures de sécurité :</p>
						<ul className="list-disc px-4">
							<li> mots de passe hachés avec Argon2 </li>
							<li> authentification JWT </li>
							<li>limitation du nombre de requêtes (rate limiting) </li>
							<li> protection XSS</li>
							<li> sécurisation des headers HTTP </li>
							<li> validation des données entrantes</li>
							<li> accès sécurisé à la base de données</li>
						</ul>
						<p className="pt-2">
							Malgré nos efforts, aucun système n’est totalement invulnérable.
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							8. Partage des données
						</h3>
						<p>Les données ne sont partagées avec aucun tiers commercial.</p>
						<p>
							Certaines données peuvent transiter via des services techniques
							nécessaires au fonctionnement du projet :
						</p>
						<ul className="list-disc px-4">
							<li> hébergement </li>
							<li> base de données </li>
							<li> outils de développement et de déploiement</li>
						</ul>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							9. Vos droits
						</h3>
						<p>Conformément au RGPD, vous disposez des droits suivants : </p>
						<ul className="list-disc px-4">
							<li> droit d’accès </li>
							<li> droit de rectification </li>
							<li> droit de suppression </li>
							<li>droit à la limitation du traitement </li>
							<li> droit d’opposition </li>
							<li> droit à la portabilité des données</li>
						</ul>
						<p className="pt-2">
							Vous pouvez exercer ces droits à l’adresse suivante : 📧
							[EMAIL_DE_CONTACT]
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							10. Suppression du compte
						</h3>
						<p>
							Vous pouvez demander la suppression de votre compte et de vos
							données associées.
						</p>
						<p>
							Certaines données techniques ou obligations légales peuvent
							nécessiter une conservation limitée temporaire.
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							11. Cookies
						</h3>
						<p>
							Actuellement, l’application n’utilise pas de cookies publicitaires
							ni de suivi marketing.
						</p>
						<p>
							Des cookies techniques ou de session peuvent être utilisés pour le
							fonctionnement de l’authentification.
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							12. Modification de la politique
						</h3>
						<p>
							Cette politique peut être modifiée afin de refléter les évolutions
							techniques, légales ou fonctionnelles du projet.
						</p>
						<p> La date de mise à jour sera indiquée en haut de cette page.</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							13. Contact
						</h3>
						<p>
							Pour toute question concernant cette politique ou vos données
							personnelles : 📧 [EMAIL_DE_CONTACT]
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							{" "}
							14. Éditeur du site
						</h3>
						<p>
							Le site et l’application <b>La Pince</b> sont édités dans le cadre
							d’un projet pédagogique réalisé durant la formation :
						</p>
						<p>
							<b>Concepteur Développeur d’Applications Web — O’clock</b>
						</p>
						<p>
							Projet pédagogique réalisé par l’équipe <b>La Pince</b> dans le
							cadre de la formation CDA de O’clock.
						</p>
						<p>Contact : 📧 [EMAIL_DE_CONTACT]</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							{" "}
							15. Hébergement
						</h3>
						<p>L’application et ses données sont hébergées par :</p>
						<p>**[NOM_HEBERGEUR]**</p>
						<p>Adresse : [ADRESSE_HEBERGEUR]</p>
						<p>Site web : [URL_HEBERGEUR]</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							{" "}
							16. Propriété intellectuelle
						</h3>
						<p>
							L’ensemble du contenu du projet <b>La Pince</b> (code source,
							interface, éléments graphiques, documentation, textes et logos)
							est protégé par les règles relatives à la propriété
							intellectuelle.
						</p>
						<p>
							Sauf mention contraire, tous les droits sont réservés aux auteurs
							du projet.
						</p>
						<h3 className="text-2xl text-center font-semibold tracking-tight py-6">
							{" "}
							17. Données collectées et finalité
						</h3>
						<p>
							Les données collectées via l’application sont strictement limitées
							aux besoins de fonctionnement du service :
						</p>
						<ul className="list-disc px-4">
							<li> création et gestion des comptes utilisateurs,</li>
							<li> gestion des projets et dépenses,</li>
							<li> calculs de répartitions financières,</li>
							<li> sécurité et maintenance technique.</li>
						</ul>
						<p className="pt-2">
							Aucune donnée n’est vendue, cédée ou utilisée à des fins
							commerciales ou publicitaires.
						</p>
						<p>
							Les détails complets concernant les données collectées, leur
							conservation et les droits des utilisateurs sont décrits dans la
							présente politique de confidentialité.
						</p>
					</article>
				</section>
			</main>

			<PublicFooter />
		</div>
	);
}
