import { disableTool } from 'eve/tools'

/** O Brain responde sobre o registro da empresa. Buscar na web e manter lista
 *  de tarefas não são capacidades deste produto — e apareceriam como passo de
 *  tool na tela, poluindo o que o §7.2 quer mostrar. */
export default disableTool()
