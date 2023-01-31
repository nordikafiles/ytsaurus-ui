import {I18N} from '@gravity-ui/i18n';
import en from './en.json';

const COMPONENT = 'timeline';

const i18n = new I18N();
i18n.setLang('en');

i18n.registerKeyset('en', COMPONENT, en);

export default i18n.keyset(COMPONENT);
