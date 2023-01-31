import {I18N} from '@gravity-ui/i18n';
import en from './en.json';

const i18n = new I18N();

i18n.setLang('en');

const COMPONENT = 'yc-column-selector';

i18n.registerKeyset('en', COMPONENT, en);

export default i18n.keyset(COMPONENT);
