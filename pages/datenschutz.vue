<script setup>
import { onMounted } from 'vue'
import DefaultLayout from '../layouts/default.vue'
import { useCookieConsent } from '../composables/useCookieConsent.js'

onMounted(() => { document.title = 'Datenschutz | Ocean Pub Dahme' })

const { consentGiven, revokeConsent } = useCookieConsent()

function resetConsent() {
  revokeConsent()
}
</script>

<template>
  <DefaultLayout>
  <div class="legal-page">
    <div class="container">
      <h1 class="page-title brand-heading">Datenschutzerklärung</h1>
      
      <div class="legal-content">
        <section class="legal-section">
          <h2>1. Datenschutz auf einen Blick</h2>
          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
            passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
            persönlich identifiziert werden können.
          </p>
          
          <h3>Datenerfassung auf dieser Website</h3>
          <p>
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br>
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
            können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
          </p>
        </section>

        <section class="legal-section">
          <h2>2. Hosting und Content Delivery Networks (CDN)</h2>
          <h3>Externes Hosting</h3>
          <p>
            Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, 
            die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann 
            es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, 
            Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.
          </p>
        </section>

        <section class="legal-section">
          <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
          <h3>Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
            Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften 
            sowie dieser Datenschutzerklärung.
          </p>

          <h3>Hinweis zur verantwortlichen Stelle</h3>
          <p>
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br><br>
            <strong>Ocean Pub Dahme</strong><br>
            An d. Strandpromenade 20<br>
            23747 Dahme<br>
            Deutschland<br><br>
            Telefon: +49 15205714152<br>
            E-Mail: info@ocean-bar.de
          </p>
          <p>
            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit 
            anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, 
            E-Mail-Adressen o. Ä.) entscheidet.
          </p>

          <h3>Speicherdauer</h3>
          <p>
            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, 
            verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. 
            Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung 
            widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für 
            die Speicherung Ihrer personenbezogenen Daten haben.
          </p>
        </section>

        <section class="legal-section">
          <h2>4. Datenerfassung auf dieser Website</h2>
          <h3>Server-Log-Dateien</h3>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, 
            die Ihr Browser automatisch an uns übermittelt. Dies sind:
          </p>
          <ul>
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p>
            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. 
            Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        <section class="legal-section">
          <h2>5. Ihre Rechte</h2>
          <p>Sie haben folgende Rechte:</p>
          <ul>
            <li>Recht auf Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten</li>
            <li>Recht auf Berichtigung unrichtiger oder unvollständiger Daten</li>
            <li>Recht auf Löschung Ihrer bei uns gespeicherten Daten</li>
            <li>Recht auf Einschränkung der Datenverarbeitung</li>
            <li>Recht auf Datenübertragbarkeit</li>
            <li>Widerspruchsrecht gegen die Verarbeitung Ihrer Daten</li>
            <li>Recht auf Beschwerde bei einer Aufsichtsbehörde</li>
          </ul>
          <p>
            Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns gerne unter info@ocean-bar.de
          </p>
        </section>

        <section class="legal-section">
          <h2>6. Nutzungsanalyse (Click-Tracking)</h2>
          <p>
            Diese Website erfasst anonymisierte Klick-Interaktionen (z. B. Klicks auf Ticket-Links oder 
            Event-Buttons), um die Nutzung unseres Angebots statistisch auszuwerten und zu verbessern.
          </p>
          <h3>Welche Daten werden erfasst?</h3>
          <ul>
            <li>Art des geklickten Elements (z. B. „Ticket", „Mehr Infos")</li>
            <li>Referenz auf das betreffende Event (interne ID)</li>
            <li>Anonymisierte IP-Adresse (letztes Oktett wird vor der Speicherung auf „0" gesetzt)</li>
            <li>Anonyme Sitzungs-ID (zufällig generiert, im Tab-Speicher des Browsers – wird beim Tab-Schließen gelöscht)</li>
            <li>Zeitstempel</li>
          </ul>
          <h3>Rechtsgrundlage</h3>
          <p>
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse 
            zur anonymen Nutzungsanalyse). Da keine personenbezogenen Daten im Sinne der DSGVO gespeichert 
            werden (IP vollständig anonymisiert, keine Cookies), ist keine Einwilligung erforderlich.
          </p>
          <h3>Weitergabe an Dritte</h3>
          <p>
            Die erfassten Daten werden ausschließlich auf unseren eigenen Servern gespeichert und nicht 
            an Dritte weitergegeben.
          </p>
        </section>

        <section class="legal-section">
          <h2>8. Instagram-Einbettung</h2>
          <p>
            Auf dieser Website werden Inhalte des sozialen Netzwerks Instagram eingebettet. 
            Anbieter ist die Meta Platforms Ireland Limited, 4 Grand Canal Square, Dublin 2, Irland.
          </p>
          <p>
            Die Instagram-Inhalte (Beiträge) werden erst geladen, wenn Sie aktiv auf die Schaltfläche 
            „Instagram-Inhalte laden" klicken (2-Klick-Lösung). Erst dann wird eine Verbindung zu den 
            Servern von Instagram/Meta hergestellt und dabei Ihre IP-Adresse sowie das Instagram-Einbettungs-Script 
            übertragen. Ihre Zustimmung wird im lokalen Speicher Ihres Browsers gespeichert.
          </p>
          <p>
            Weitere Informationen finden Sie im 
            <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener noreferrer">Datenschutzcenter von Instagram</a>.
          </p>
        </section>

        <section class="legal-section">
          <h2>9. Cookie-Einstellungen</h2>
          <p>
            Beim ersten Besuch dieser Website werden Sie über einen Banner um Ihre Zustimmung zur Nutzung
            externer Dienste gebeten. Sie können Ihre Einwilligung jederzeit widerrufen,
            indem Sie die Schaltfläche unten verwenden. Danach werden externe Inhalte erst nach erneuter
            Zustimmung geladen.
          </p>
          <p>
            Ihre Einstellungen werden im lokalen Speicher (localStorage) Ihres Browsers gespeichert und
            laufen nach 6 Monaten automatisch ab. Es werden keine Cookies an Drittanbieter übertragen.
          </p>
          <div class="consent-revoke">
            <p v-if="consentGiven" class="consent-status">
              ✓ Sie haben Ihre Cookie-Einstellungen bereits festgelegt.
            </p>
            <p v-else class="consent-status">
              Sie haben noch keine Cookie-Einstellungen festgelegt.
            </p>
            <button v-if="consentGiven" class="revoke-btn" @click="resetConsent">
              Cookie-Einstellungen zurücksetzen
            </button>
          </div>
        </section>

        <div class="legal-footer">
          <p><small>Stand: April 2026</small></p>
        </div>
      </div>
    </div>
  </div>
  </DefaultLayout>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: var(--beach-sky, #EAF6FB);
  color: var(--beach-navy, #163A4E);
  padding: 6rem 0 4rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3rem);
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--beach-navy, #163A4E);
}

.legal-content {
  background: var(--beach-sand, #FBF3E4);
  border-radius: 20px;
  padding: 3rem;
  border: 1.5px solid rgba(22, 58, 78, 0.12);
  box-shadow: 0 4px 24px rgba(22, 58, 78, 0.08);
}

.legal-section {
  margin-bottom: 3rem;
}

.legal-section:last-child {
  margin-bottom: 0;
}

.legal-section h2 {
  color: var(--beach-navy, #163A4E);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--beach-coral, #E8614D);
}

.legal-section h3 {
  color: var(--beach-ocean, #2A7FA5);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
}

.legal-section p {
  color: rgba(22, 58, 78, 0.85);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.legal-section ul {
  color: rgba(22, 58, 78, 0.85);
  line-height: 1.7;
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.legal-section li {
  margin-bottom: 0.5rem;
}

.legal-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1.5px solid rgba(22, 58, 78, 0.12);
  text-align: center;
}

.legal-footer small {
  color: rgba(22, 58, 78, 0.5);
}

.legal-content a {
  color: var(--beach-ocean, #2A7FA5);
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

.legal-content a:hover {
  color: var(--beach-coral, #E8614D);
}

/* Consent Revoke Section */
.consent-revoke {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  background: rgba(42, 127, 165, 0.07);
  border: 1.5px solid rgba(42, 127, 165, 0.18);
}

.consent-status {
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  color: rgba(22, 58, 78, 0.75);
}

.revoke-btn {
  padding: 0.6rem 1.5rem;
  background: transparent;
  border: 1.5px solid rgba(22, 58, 78, 0.3);
  border-radius: 50px;
  color: var(--beach-navy, #163A4E) !important;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.revoke-btn:hover {
  border-color: var(--beach-coral, #E8614D);
  color: var(--beach-coral, #E8614D) !important;
  transform: translateY(-1px);
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .legal-page {
    padding: 4rem 0 2rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .legal-content {
    padding: 2rem;
  }
  
  .page-title {
    margin-bottom: 2rem;
  }
  
  .legal-section {
    margin-bottom: 2rem;
  }
  
  .legal-section h2 {
    font-size: 1.3rem;
  }
  
  .legal-section h3 {
    font-size: 1.1rem;
  }
}
</style>