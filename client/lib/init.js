/* just to avoid the buffer problem in meteor 1.6 */

global.Buffer = global.Buffer || require("buffer").Buffer;