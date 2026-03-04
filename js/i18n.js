/**
 * TuneLocal Internationalization (i18n)
 * Multi-language support system
 * Version 1.0.1 - Enhanced i18n capabilities
 */

class I18nManager {
    constructor() {
        this.currentLanguage = this.getSystemLanguage();
        this.languages = {
            en: 'English',
            es: 'Español',
            fr: 'Français',
            de: 'Deutsch',
            it: 'Italiano',
            pt: 'Português',
            ja: '日本語',
            zh: '中文',
            ko: '한국어',
            ru: 'Русский'
        };
        
        this.translations = {
            en: {
                // Navigation
                nav_home: 'Home',
                nav_spotify: 'Spotify',
                nav_youtube: 'YouTube',
                nav_discover: 'Discover',
                nav_saved: 'Saved Songs',
                nav_offline: 'Offline Music',
                nav_downloader: 'Downloader',
                nav_playlists: 'Playlists',
                
                // Main sections
                title: 'TuneLocal - Your Personal Music Hub',
                subtitle: 'All your favorite music in one place',
                btn_open_spotify: 'Open Spotify',
                btn_open_youtube: 'Open YouTube',
                
                // Common actions
                play: 'Play',
                pause: 'Pause',
                download: 'Download',
                share: 'Share',
                delete: 'Delete',
                save: 'Save',
                cancel: 'Cancel',
                search: 'Search',
                settings: 'Settings',
                help: 'Help',
                
                // Messages
                msg_loading: 'Loading...',
                msg_success: 'Success!',
                msg_error: 'Error occurred',
                msg_no_results: 'No results found',
                msg_please_wait: 'Please wait...',
                
                // Errors
                err_invalid_url: 'Invalid URL provided',
                err_network: 'Network error',
                err_not_found: 'Not found',
                err_permission: 'Permission denied',
                
                // Sleep Timer
                sleep_timer: 'Sleep Timer',
                sleep_minutes: 'Minutes',
                sleep_set: 'Set Timer',
                sleep_cancel: 'Cancel',
                
                // Visualizer
                visualizer: 'Visualizer',
                visualizer_enable: 'Enable',
                visualizer_disable: 'Disable',
                
                // Statistics
                stats: 'Statistics',
                stats_total_plays: 'Total Plays',
                stats_listening_time: 'Listening Time',
                stats_favorite: 'Favorite Platform',
                stats_streak: 'Day Streak',
                stats_today: 'Today',
                stats_this_week: 'This Week',
                stats_this_month: 'This Month',
                
                // Equalizer
                eq_equalizer: 'Equalizer',
                eq_preset: 'Preset',
                eq_flat: 'Flat',
                eq_pop: 'Pop',
                eq_rock: 'Rock',
                eq_jazz: 'Jazz',
                eq_reset: 'Reset',
                
                // Share
                share_link: 'Share Link',
                share_qr: 'QR Code',
                share_facebook: 'Facebook',
                share_twitter: 'Twitter',
                share_whatsapp: 'WhatsApp',
                share_email: 'Email',
                share_copy: 'Copy Link',
                share_copied: 'Copied to Clipboard',
                
                // Recently Played
                recently_played: 'Recently Played',
                clear_history: 'Clear History',
                
                // Playlists
                playlist_name: 'Playlist Name',
                playlist_url: 'Playlist URL',
                create_playlist: 'Create Playlist',
                save_playlist: 'Save Playlist',
                
                // Offline
                upload_music: 'Upload Music',
                select_files: 'Select Files',
                uploading: 'Uploading...',
                upload_complete: 'Upload Complete',
                
                // Theme
                dark_mode: 'Dark Mode',
                light_mode: 'Light Mode',
                
                // Language
                language: 'Language'
            },
            
            es: {
                nav_home: 'Inicio',
                nav_spotify: 'Spotify',
                nav_youtube: 'YouTube',
                nav_discover: 'Descubrir',
                nav_saved: 'Canciones Guardadas',
                nav_offline: 'Música Offline',
                nav_downloader: 'Descargador',
                nav_playlists: 'Listas de Reproducción',
                
                title: 'TuneLocal - Tu Centro de Música Personal',
                subtitle: 'Toda tu música favorita en un solo lugar',
                btn_open_spotify: 'Abrir Spotify',
                btn_open_youtube: 'Abrir YouTube',
                
                play: 'Reproducir',
                pause: 'Pausar',
                download: 'Descargar',
                share: 'Compartir',
                delete: 'Eliminar',
                save: 'Guardar',
                cancel: 'Cancelar',
                search: 'Buscar',
                settings: 'Configuración',
                help: 'Ayuda',
                
                msg_loading: 'Cargando...',
                msg_success: '¡Éxito!',
                msg_error: 'Ocurrió un error',
                msg_no_results: 'Sin resultados',
                msg_please_wait: 'Por favor espere...',
                
                err_invalid_url: 'URL inválida',
                err_network: 'Error de red',
                err_not_found: 'No encontrado',
                err_permission: 'Permiso denegado',
                
                sleep_timer: 'Temporizador de Sueño',
                sleep_minutes: 'Minutos',
                sleep_set: 'Establecer',
                sleep_cancel: 'Cancelar',
                
                visualizer: 'Visualizador',
                visualizer_enable: 'Habilitar',
                visualizer_disable: 'Deshabilitar',
                
                stats: 'Estadísticas',
                stats_total_plays: 'Reproducciones Totales',
                stats_listening_time: 'Tiempo de Escucha',
                stats_favorite: 'Plataforma Favorita',
                stats_streak: 'Racha de Días',
                stats_today: 'Hoy',
                stats_this_week: 'Esta Semana',
                stats_this_month: 'Este Mes',
                
                eq_equalizer: 'Ecualizador',
                eq_preset: 'Predefinición',
                eq_flat: 'Plano',
                eq_pop: 'Pop',
                eq_rock: 'Rock',
                eq_jazz: 'Jazz',
                eq_reset: 'Reiniciar',
                
                share_link: 'Enlace de Compartición',
                share_qr: 'Código QR',
                share_facebook: 'Facebook',
                share_twitter: 'Twitter',
                share_whatsapp: 'WhatsApp',
                share_email: 'Correo',
                share_copy: 'Copiar Enlace',
                share_copied: 'Copiado al Portapapeles',
                
                recently_played: 'Reprodujido Recientemente',
                clear_history: 'Limpiar Historial',
                
                playlist_name: 'Nombre de la Lista',
                playlist_url: 'URL de la Lista',
                create_playlist: 'Crear Lista',
                save_playlist: 'Guardar Lista',
                
                upload_music: 'Subir Música',
                select_files: 'Seleccionar Archivos',
                uploading: 'Subiendo...',
                upload_complete: 'Subida Completa',
                
                dark_mode: 'Modo Oscuro',
                light_mode: 'Modo Claro',
                
                language: 'Idioma'
            },
            
            fr: {
                nav_home: 'Accueil',
                nav_spotify: 'Spotify',
                nav_youtube: 'YouTube',
                nav_discover: 'Découvrir',
                nav_saved: 'Chansons Sauvegardées',
                nav_offline: 'Musique Hors Ligne',
                nav_downloader: 'Téléchargeur',
                nav_playlists: 'Listes de Lecture',
                
                title: 'TuneLocal - Votre Hub Musical Personnel',
                subtitle: 'Toute votre musique préférée en un seul endroit',
                btn_open_spotify: 'Ouvrir Spotify',
                btn_open_youtube: 'Ouvrir YouTube',
                
                play: 'Lire',
                pause: 'Pause',
                download: 'Télécharger',
                share: 'Partager',
                delete: 'Supprimer',
                save: 'Enregistrer',
                cancel: 'Annuler',
                search: 'Rechercher',
                settings: 'Paramètres',
                help: 'Aide',
                
                msg_loading: 'Chargement...',
                msg_success: 'Succès!',
                msg_error: 'Une erreur sest produite',
                msg_no_results: 'Aucun résultat',
                msg_please_wait: 'Veuillez patienter...',
                
                err_invalid_url: 'URL invalide',
                err_network: 'Erreur réseau',
                err_not_found: 'Non trouvé',
                err_permission: 'Permission refusée',
                
                sleep_timer: 'Minuteur de Sommeil',
                sleep_minutes: 'Minutes',
                sleep_set: 'Définir',
                sleep_cancel: 'Annuler',
                
                visualizer: 'Visualiseur',
                visualizer_enable: 'Activer',
                visualizer_disable: 'Désactiver',
                
                stats: 'Statistiques',
                stats_total_plays: 'Lectures Totales',
                stats_listening_time: 'Temps d\'Écoute',
                stats_favorite: 'Plateforme Préférée',
                stats_streak: 'Série de Jours',
                stats_today: 'Aujourd\'hui',
                stats_this_week: 'Cette Semaine',
                stats_this_month: 'Ce Mois',
                
                eq_equalizer: 'Égaliseur',
                eq_preset: 'Préréglage',
                eq_flat: 'Plat',
                eq_pop: 'Pop',
                eq_rock: 'Rock',
                eq_jazz: 'Jazz',
                eq_reset: 'Réinitialiser',
                
                share_link: 'Lien de Partage',
                share_qr: 'Code QR',
                share_facebook: 'Facebook',
                share_twitter: 'Twitter',
                share_whatsapp: 'WhatsApp',
                share_email: 'Email',
                share_copy: 'Copier le Lien',
                share_copied: 'Copié dans le Presse-papiers',
                
                recently_played: 'Récemment Joué',
                clear_history: 'Effacer Historique',
                
                playlist_name: 'Nom de la Liste',
                playlist_url: 'URL de la Liste',
                create_playlist: 'Créer une Liste',
                save_playlist: 'Enregistrer la Liste',
                
                upload_music: 'Télécharger la Musique',
                select_files: 'Sélectionner des Fichiers',
                uploading: 'Téléchargement...',
                upload_complete: 'Téléchargement Terminé',
                
                dark_mode: 'Mode Sombre',
                light_mode: 'Mode Clair',
                
                language: 'Langue'
            }
        };

        // Load saved language preference
        this.load();
    }

    /**
     * Get system language or default to English
     */
    getSystemLanguage() {
        const saved = localStorage.getItem('tunelocal_language');
        if (saved) return saved;

        const browserLang = navigator.language.split('-')[0];
        return Object.keys(this.languages).includes(browserLang) ? browserLang : 'en';
    }

    /**
     * Get translation for key
     */
    t(key, defaultValue = key) {
        if (!this.translations[this.currentLanguage]) {
            return this.translations['en'][key] || defaultValue;
        }
        return this.translations[this.currentLanguage][key] || 
               this.translations['en'][key] || 
               defaultValue;
    }

    /**
     * Set language
     */
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error('Language not supported:', lang);
            return false;
        }

        this.currentLanguage = lang;
        localStorage.setItem('tunelocal_language', lang);
        this.updatePageTranslations();
        return true;
    }

    /**
     * Get current language
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get all available languages
     */
    getLanguages() {
        return this.languages;
    }

    /**
     * Update all page translations
     */
    updatePageTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Emit custom event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    /**
     * Add translation helper function to window
     */
    setupGlobalHelper() {
        window.i18n = this.t.bind(this);
    }

    /**
     * Load language
     */
    load() {
        this.updatePageTranslations();
        this.setupGlobalHelper();
    }

    /**
     * Export all translations
     */
    export(lang) {
        const blob = new Blob(
            [JSON.stringify(this.translations[lang], null, 2)],
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunelocal_translations_${lang}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Add custom translations
     */
    addTranslations(lang, translations) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        this.translations[lang] = {
            ...this.translations[lang],
            ...translations
        };
    }
}

// Global instance
const i18n = new I18nManager();

// Setup global translation function
window.getTranslation = (key, defaultValue) => i18n.t(key, defaultValue);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    i18n.load();
});
