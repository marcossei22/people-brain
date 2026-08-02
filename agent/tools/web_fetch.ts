import { disableTool } from 'eve/tools'

/** Decisão #16: o Brain não executa nada. Nada é escrito, nada roda em shell.
 *  As tools de acesso sobre dados tipados são a única superfície. */
export default disableTool()
