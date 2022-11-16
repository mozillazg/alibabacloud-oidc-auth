require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 6210:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const default_credential_1 = __importDefault(__nccwpck_require__(3173));
const config_1 = __importDefault(__nccwpck_require__(2944));
class AccessKeyCredential extends default_credential_1.default {
    constructor(accessKeyId, accessKeySecret) {
        if (!accessKeyId) {
            throw new Error('Missing required accessKeyId option in config for access_key');
        }
        if (!accessKeySecret) {
            throw new Error('Missing required accessKeySecret option in config for access_key');
        }
        const conf = new config_1.default({
            type: 'access_key',
            accessKeyId,
            accessKeySecret
        });
        super(conf);
    }
}
exports["default"] = AccessKeyCredential;
//# sourceMappingURL=access_key_credential.js.map

/***/ }),

/***/ 6992:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const default_credential_1 = __importDefault(__nccwpck_require__(3173));
const config_1 = __importDefault(__nccwpck_require__(2944));
class BearerTokenCredential extends default_credential_1.default {
    constructor(bearerToken) {
        if (!bearerToken) {
            throw new Error('Missing required bearerToken option in config for bearer');
        }
        const conf = new config_1.default({
            type: 'bearer'
        });
        super(conf);
        this.bearerToken = bearerToken;
    }
}
exports["default"] = BearerTokenCredential;
//# sourceMappingURL=bearer_token_credential.js.map

/***/ }),

/***/ 4060:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Config = void 0;
const access_key_credential_1 = __importDefault(__nccwpck_require__(6210));
const sts_token_credential_1 = __importDefault(__nccwpck_require__(8006));
const ecs_ram_role_credential_1 = __importDefault(__nccwpck_require__(4089));
const ram_role_arn_credential_1 = __importDefault(__nccwpck_require__(8766));
const oidc_role_arn_credential_1 = __importDefault(__nccwpck_require__(7742));
const rsa_key_pair_credential_1 = __importDefault(__nccwpck_require__(8067));
const bearer_token_credential_1 = __importDefault(__nccwpck_require__(6992));
const DefaultProvider = __importStar(__nccwpck_require__(6833));
const config_1 = __importDefault(__nccwpck_require__(2944));
exports.Config = config_1.default;
const uri_credential_1 = __importDefault(__nccwpck_require__(6215));
class Credential {
    constructor(config = null, runtime = {}) {
        this.load(config, runtime);
    }
    getAccessKeyId() {
        return this.credential.getAccessKeyId();
    }
    getAccessKeySecret() {
        return this.credential.getAccessKeySecret();
    }
    getSecurityToken() {
        return this.credential.getSecurityToken();
    }
    getBearerToken() {
        return this.credential.getBearerToken();
    }
    getType() {
        return this.credential.getType();
    }
    load(config, runtime) {
        if (!config) {
            this.credential = DefaultProvider.getCredentials();
            return;
        }
        if (!config.type) {
            throw new Error('Missing required type option');
        }
        switch (config.type) {
            case 'access_key':
                this.credential = new access_key_credential_1.default(config.accessKeyId, config.accessKeySecret);
                break;
            case 'sts':
                this.credential = new sts_token_credential_1.default(config.accessKeyId, config.accessKeySecret, config.securityToken);
                break;
            case 'ecs_ram_role':
                this.credential = new ecs_ram_role_credential_1.default(config.roleName);
                break;
            case 'ram_role_arn':
                this.credential = new ram_role_arn_credential_1.default(config, runtime);
                break;
            case 'oidc_role_arn':
                this.credential = new oidc_role_arn_credential_1.default(config, runtime);
                break;
            case 'rsa_key_pair':
                this.credential = new rsa_key_pair_credential_1.default(config.publicKeyId, config.privateKeyFile);
                break;
            case 'bearer':
                this.credential = new bearer_token_credential_1.default(config.bearerToken);
                break;
            case 'credentials_uri':
                this.credential = new uri_credential_1.default(config.credentialsURI);
                break;
            default:
                throw new Error('Invalid type option, support: access_key, sts, ecs_ram_role, ram_role_arn, rsa_key_pair, credentials_uri');
        }
    }
}
exports["default"] = Credential;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 2944:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const $tea = __importStar(__nccwpck_require__(4165));
class Config extends $tea.Model {
    constructor(config) {
        super(config);
    }
    static names() {
        return {
            accessKeyId: 'accessKeyId',
            accessKeySecret: 'accessKeySecret',
            securityToken: 'securityToken',
            bearerToken: 'bearerToken',
            durationSeconds: 'durationSeconds',
            roleArn: 'roleArn',
            policy: 'policy',
            roleSessionExpiration: 'roleSessionExpiration',
            roleSessionName: 'roleSessionName',
            publicKeyId: 'publicKeyId',
            privateKeyFile: 'privateKeyFile',
            roleName: 'roleName',
            credentialsURI: 'credentialsURI',
            oidcProviderArn: 'oidcProviderArn',
            oidcTokenFilePath: 'oidcTokenFilePath',
            type: 'type',
        };
    }
    static types() {
        return {
            accessKeyId: 'string',
            accessKeySecret: 'string',
            securityToken: 'string',
            bearerToken: 'string',
            durationSeconds: 'number',
            roleArn: 'string',
            policy: 'string',
            roleSessionExpiration: 'number',
            roleSessionName: 'string',
            publicKeyId: 'string',
            privateKeyFile: 'string',
            roleName: 'string',
            credentialsURI: 'string',
            oidcProviderArn: 'string',
            oidcTokenFilePath: 'string',
            type: 'string',
        };
    }
}
exports["default"] = Config;
//# sourceMappingURL=config.js.map

/***/ }),

/***/ 3173:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class DefaultCredential {
    constructor(config) {
        this.accessKeyId = config.accessKeyId || '';
        this.accessKeySecret = config.accessKeySecret || '';
        this.securityToken = config.securityToken || '';
        this.bearerToken = config.bearerToken || '';
        this.type = config.type || '';
    }
    async getAccessKeyId() {
        return this.accessKeyId;
    }
    async getAccessKeySecret() {
        return this.accessKeySecret;
    }
    async getSecurityToken() {
        return this.securityToken;
    }
    getBearerToken() {
        return this.bearerToken;
    }
    getType() {
        return this.type;
    }
}
exports["default"] = DefaultCredential;
//# sourceMappingURL=default_credential.js.map

/***/ }),

/***/ 4089:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const session_credential_1 = __importDefault(__nccwpck_require__(1206));
const httpx_1 = __importDefault(__nccwpck_require__(9074));
const config_1 = __importDefault(__nccwpck_require__(2944));
const SECURITY_CRED_URL = 'http://100.100.100.200/latest/meta-data/ram/security-credentials/';
class EcsRamRoleCredential extends session_credential_1.default {
    constructor(roleName = '', runtime = {}) {
        const conf = new config_1.default({
            type: 'ecs_ram_role',
        });
        super(conf);
        this.roleName = roleName;
        this.runtime = runtime;
        this.sessionCredential = null;
    }
    async getBody(url) {
        const response = await httpx_1.default.request(url, {});
        return (await httpx_1.default.read(response, 'utf8'));
    }
    async updateCredential() {
        const roleName = await this.getRoleName();
        const url = SECURITY_CRED_URL + roleName;
        const body = await this.getBody(url);
        const json = JSON.parse(body);
        this.sessionCredential = {
            AccessKeyId: json.AccessKeyId,
            AccessKeySecret: json.AccessKeySecret,
            Expiration: json.Expiration,
            SecurityToken: json.SecurityToken,
        };
    }
    async getRoleName() {
        if (this.roleName && this.roleName.length) {
            return this.roleName;
        }
        return await this.getBody(SECURITY_CRED_URL);
    }
}
exports["default"] = EcsRamRoleCredential;
//# sourceMappingURL=ecs_ram_role_credential.js.map

/***/ }),

/***/ 7742:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const session_credential_1 = __importDefault(__nccwpck_require__(1206));
const http_1 = __nccwpck_require__(6050);
const config_1 = __importDefault(__nccwpck_require__(2944));
const fs_1 = __importDefault(__nccwpck_require__(7147));
class OidcRoleArnCredential extends session_credential_1.default {
    constructor(config, runtime = {}) {
        if (!config.roleArn) {
            throw new Error('Missing required roleArn option in config for oidc_role_arn');
        }
        if (!config.oidcProviderArn) {
            throw new Error('Missing required oidcProviderArn option in config for oidc_role_arn');
        }
        if (!config.oidcTokenFilePath) {
            config.oidcTokenFilePath = process.env['ALIBABA_CLOUD_OIDC_TOKEN_FILE'];
            if (!config.oidcTokenFilePath) {
                throw new Error('oidcTokenFilePath is not exists and env ALIBABA_CLOUD_OIDC_TOKEN_FILE is null.');
            }
        }
        const conf = new config_1.default({
            type: 'oidc_role_arn',
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret
        });
        super(conf);
        this.oidcTokenFilePath = config.oidcTokenFilePath;
        this.roleArn = config.roleArn;
        this.policy = config.policy;
        this.oidcProviderArn = config.oidcProviderArn;
        this.durationSeconds = config.roleSessionExpiration || 3600;
        this.roleSessionName = config.roleSessionName || 'role_session_name';
        runtime.method = 'POST';
        this.runtime = runtime;
        this.host = 'https://sts.aliyuncs.com';
    }
    getOdicToken(oidcTokenFilePath) {
        if (!fs_1.default.existsSync(oidcTokenFilePath)) {
            throw new Error(`oidcTokenFilePath ${oidcTokenFilePath}  is not exists.`);
        }
        let oidcToken = null;
        try {
            oidcToken = fs_1.default.readFileSync(oidcTokenFilePath, 'utf-8');
        }
        catch (err) {
            throw new Error(`oidcTokenFilePath ${oidcTokenFilePath} cannot be read.`);
        }
        return oidcToken;
    }
    async updateCredential() {
        const oidcToken = this.getOdicToken(this.oidcTokenFilePath);
        const params = {
            Action: 'AssumeRoleWithOIDC',
            RoleArn: this.roleArn,
            OIDCProviderArn: this.oidcProviderArn,
            OIDCToken: oidcToken,
            DurationSeconds: this.durationSeconds,
            RoleSessionName: this.roleSessionName
        };
        if (this.policy) {
            params.policy = this.policy;
        }
        const json = await http_1.request(this.host, params, this.runtime, this.accessKeySecret);
        this.sessionCredential = json.Credentials;
    }
}
exports["default"] = OidcRoleArnCredential;
//# sourceMappingURL=oidc_role_arn_credential.js.map

/***/ }),

/***/ 4259:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const uri_credential_1 = __importDefault(__nccwpck_require__(6215));
exports["default"] = {
    getCredential() {
        const credentialsURI = process.env.ALIBABA_CLOUD_CREDENTIALS_URI;
        if (credentialsURI) {
            return new uri_credential_1.default(credentialsURI);
        }
        return null;
    }
};
//# sourceMappingURL=credentials_uri_provider.js.map

/***/ }),

/***/ 3448:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const access_key_credential_1 = __importDefault(__nccwpck_require__(6210));
exports["default"] = {
    getCredential() {
        const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
        const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
        if (accessKeyId === undefined || accessKeySecret === undefined) {
            return null;
        }
        if (accessKeyId === null || accessKeyId === '') {
            throw new Error('Environment variable ALIBABA_CLOUD_ACCESS_KEY_ID cannot be empty');
        }
        if (accessKeySecret === null || accessKeySecret === '') {
            throw new Error('Environment variable ALIBABA_CLOUD_ACCESS_KEY_SECRET cannot be empty');
        }
        return new access_key_credential_1.default(accessKeyId, accessKeySecret);
    }
};
//# sourceMappingURL=environment_variable_credentials_provider.js.map

/***/ }),

/***/ 5940:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ecs_ram_role_credential_1 = __importDefault(__nccwpck_require__(4089));
exports["default"] = {
    getCredential() {
        const roleName = process.env.ALIBABA_CLOUD_ECS_METADATA;
        if (roleName && roleName.length) {
            return new ecs_ram_role_credential_1.default(roleName);
        }
        return null;
    }
};
//# sourceMappingURL=instance_ram_role_credentials_provider.js.map

/***/ }),

/***/ 1245:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const access_key_credential_1 = __importDefault(__nccwpck_require__(6210));
const sts_token_credential_1 = __importDefault(__nccwpck_require__(8006));
const ecs_ram_role_credential_1 = __importDefault(__nccwpck_require__(4089));
const ram_role_arn_credential_1 = __importDefault(__nccwpck_require__(8766));
const rsa_key_pair_credential_1 = __importDefault(__nccwpck_require__(8067));
const bearer_token_credential_1 = __importDefault(__nccwpck_require__(6992));
const utils = __importStar(__nccwpck_require__(6517));
const fs_1 = __importDefault(__nccwpck_require__(7147));
const config_1 = __importDefault(__nccwpck_require__(2944));
const DEFAULT_PATH = process.env.HOME + '/.alibabacloud/credentials';
exports["default"] = {
    getCredential(credentialName = 'default') {
        let fileContent = null;
        const credentialFile = process.env.ALIBABA_CLOUD_CREDENTIALS_FILE;
        if (credentialFile === undefined) {
            if (fs_1.default.existsSync(DEFAULT_PATH)) {
                const content = utils.parseFile(DEFAULT_PATH, true);
                if (content) {
                    fileContent = content;
                }
            }
        }
        else {
            if (credentialFile === null || credentialFile === '') {
                throw new Error('Environment variable credentialFile cannot be empty');
            }
            if (!fs_1.default.existsSync(credentialFile)) {
                throw new Error(`credentialFile ${credentialFile} cannot be empty`);
            }
            fileContent = utils.parseFile(credentialFile);
        }
        if (!fileContent) {
            return null;
        }
        const config = fileContent[credentialName] || {};
        if (!config.type) {
            throw new Error('Missing required type option in credentialFile');
        }
        switch (config.type) {
            case 'access_key':
                return new access_key_credential_1.default(config.access_key_id, config.access_key_secret);
            case 'sts':
                return new sts_token_credential_1.default(config.access_key_id, config.access_key_secret, config.security_token);
            case 'ecs_ram_role':
                return new ecs_ram_role_credential_1.default(config.role_name);
            case 'ram_role_arn': {
                const conf = new config_1.default({
                    roleArn: config.role_arn,
                    accessKeyId: config.access_key_id,
                    accessKeySecret: config.access_key_secret
                });
                return new ram_role_arn_credential_1.default(conf);
            }
            case 'rsa_key_pair':
                return new rsa_key_pair_credential_1.default(config.public_key_id, config.private_key_file);
            case 'bearer':
                return new bearer_token_credential_1.default(config.bearer_token);
            default:
                throw new Error('Invalid type option, support: access_key, sts, ecs_ram_role, ram_role_arn, rsa_key_pair');
        }
    }
};
//# sourceMappingURL=profile_credentials_provider.js.map

/***/ }),

/***/ 6833:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCredentials = void 0;
const environment_variable_credentials_provider_1 = __importDefault(__nccwpck_require__(3448));
const profile_credentials_provider_1 = __importDefault(__nccwpck_require__(1245));
const instance_ram_role_credentials_provider_1 = __importDefault(__nccwpck_require__(5940));
const credentials_uri_provider_1 = __importDefault(__nccwpck_require__(4259));
const defaultProviders = [
    environment_variable_credentials_provider_1.default,
    profile_credentials_provider_1.default,
    instance_ram_role_credentials_provider_1.default,
    credentials_uri_provider_1.default
];
function getCredentials(providers = null) {
    const providerChain = providers || defaultProviders;
    for (const provider of providerChain) {
        const credential = provider.getCredential();
        if (credential) {
            return credential;
        }
    }
    return null;
}
exports.getCredentials = getCredentials;
//# sourceMappingURL=provider_chain.js.map

/***/ }),

/***/ 8766:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const session_credential_1 = __importDefault(__nccwpck_require__(1206));
const http_1 = __nccwpck_require__(6050);
const config_1 = __importDefault(__nccwpck_require__(2944));
class RamRoleArnCredential extends session_credential_1.default {
    constructor(config, runtime = {}) {
        if (!config.accessKeyId) {
            throw new Error('Missing required accessKeyId option in config for ram_role_arn');
        }
        if (!config.accessKeySecret) {
            throw new Error('Missing required accessKeySecret option in config for ram_role_arn');
        }
        if (!config.roleArn) {
            throw new Error('Missing required roleArn option in config for ram_role_arn');
        }
        const conf = new config_1.default({
            type: 'ram_role_arn',
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
        });
        super(conf);
        this.roleArn = config.roleArn;
        this.policy = config.policy;
        this.durationSeconds = config.roleSessionExpiration || 3600;
        this.roleSessionName = config.roleSessionName || 'role_session_name';
        this.runtime = runtime;
        this.host = 'https://sts.aliyuncs.com';
    }
    async updateCredential() {
        const params = {
            accessKeyId: this.accessKeyId,
            roleArn: this.roleArn,
            action: 'AssumeRole',
            durationSeconds: this.durationSeconds,
            roleSessionName: this.roleSessionName
        };
        if (this.policy) {
            params.policy = this.policy;
        }
        const json = await http_1.request(this.host, params, this.runtime, this.accessKeySecret);
        this.sessionCredential = json.Credentials;
    }
}
exports["default"] = RamRoleArnCredential;
//# sourceMappingURL=ram_role_arn_credential.js.map

/***/ }),

/***/ 8067:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs_1 = __importDefault(__nccwpck_require__(7147));
const session_credential_1 = __importDefault(__nccwpck_require__(1206));
const utils = __importStar(__nccwpck_require__(6517));
const http_1 = __nccwpck_require__(6050);
const config_1 = __importDefault(__nccwpck_require__(2944));
const SECURITY_CRED_URL = 'http://100.100.100.200/latest/meta-data/ram/security-credentials/';
class RsaKeyPairCredential extends session_credential_1.default {
    constructor(publicKeyId, privateKeyFile) {
        if (!publicKeyId) {
            throw new Error('Missing required publicKeyId option in config for rsa_key_pair');
        }
        if (!privateKeyFile) {
            throw new Error('Missing required privateKeyFile option in config for rsa_key_pair');
        }
        if (!fs_1.default.existsSync(privateKeyFile)) {
            throw new Error(`privateKeyFile ${privateKeyFile} cannot be empty`);
        }
        const conf = new config_1.default({
            type: 'rsa_key_pair'
        });
        super(conf);
        this.privateKey = utils.parseFile(privateKeyFile);
        this.publicKeyId = publicKeyId;
    }
    async updateCredential() {
        const url = SECURITY_CRED_URL + this.roleName;
        const json = await http_1.request(url, {
            accessKeyId: this.publicKeyId,
            action: 'GenerateSessionAccessKey',
            durationSeconds: 3600,
            signatureMethod: 'SHA256withRSA',
            signatureType: 'PRIVATEKEY',
        }, {}, this.privateKey);
        this.sessionCredential = json.Credentials;
    }
}
exports["default"] = RsaKeyPairCredential;
//# sourceMappingURL=rsa_key_pair_credential.js.map

/***/ }),

/***/ 1206:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const default_credential_1 = __importDefault(__nccwpck_require__(3173));
const utils = __importStar(__nccwpck_require__(6517));
const config_1 = __importDefault(__nccwpck_require__(2944));
class SessionCredential extends default_credential_1.default {
    constructor(config) {
        const conf = new config_1.default({
            type: config.type,
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
        });
        super(conf);
        this.sessionCredential = null;
        this.durationSeconds = config.durationSeconds || 3600;
    }
    async updateCredential() {
        throw new Error('need implemented in sub-class');
    }
    async ensureCredential() {
        const needUpdate = this.needUpdateCredential();
        if (needUpdate) {
            await this.updateCredential();
        }
    }
    async getAccessKeyId() {
        await this.ensureCredential();
        return this.sessionCredential.AccessKeyId;
    }
    async getAccessKeySecret() {
        await this.ensureCredential();
        return this.sessionCredential.AccessKeySecret;
    }
    async getSecurityToken() {
        await this.ensureCredential();
        return this.sessionCredential.SecurityToken;
    }
    needUpdateCredential() {
        if (!this.sessionCredential || !this.sessionCredential.Expiration || !this.sessionCredential.AccessKeyId || !this.sessionCredential.AccessKeySecret || !this.sessionCredential.SecurityToken) {
            return true;
        }
        const expireTime = utils.timestamp(new Date(), this.durationSeconds * 0.05 * 1000);
        if (this.sessionCredential.Expiration < expireTime) {
            return true;
        }
        return false;
    }
}
exports["default"] = SessionCredential;
//# sourceMappingURL=session_credential.js.map

/***/ }),

/***/ 8006:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const default_credential_1 = __importDefault(__nccwpck_require__(3173));
const config_1 = __importDefault(__nccwpck_require__(2944));
class StsTokenCredential extends default_credential_1.default {
    constructor(accessKeyId, accessKeySecret, securityToken) {
        if (!accessKeyId) {
            throw new Error('Missing required accessKeyId option in config for sts');
        }
        if (!accessKeySecret) {
            throw new Error('Missing required accessKeySecret option in config for sts');
        }
        if (!securityToken) {
            throw new Error('Missing required securityToken option in config for sts');
        }
        const conf = new config_1.default({
            type: 'sts',
            accessKeyId,
            accessKeySecret,
            securityToken
        });
        super(conf);
    }
}
exports["default"] = StsTokenCredential;
//# sourceMappingURL=sts_token_credential.js.map

/***/ }),

/***/ 6215:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const httpx_1 = __importDefault(__nccwpck_require__(9074));
const config_1 = __importDefault(__nccwpck_require__(2944));
const session_credential_1 = __importDefault(__nccwpck_require__(1206));
class URICredential extends session_credential_1.default {
    constructor(uri) {
        const conf = new config_1.default({
            type: 'credentials_uri',
            credentialsURI: uri
        });
        super(conf);
        if (!uri) {
            this.credentialsURI = process.env['ALIBABA_CLOUD_CREDENTIALS_URI'];
        }
        else {
            this.credentialsURI = uri;
        }
        if (!this.credentialsURI) {
            throw new Error('Missing required credentialsURI option in config or environment variable for credentials_uri');
        }
    }
    async updateCredential() {
        const url = this.credentialsURI;
        const response = await httpx_1.default.request(url, {});
        if (response.statusCode !== 200) {
            throw new Error(`Get credentials from ${url} failed, status code is ${response.statusCode}`);
        }
        const body = (await httpx_1.default.read(response, 'utf8'));
        let json;
        try {
            json = JSON.parse(body);
        }
        catch (ex) {
            throw new Error(`Get credentials from ${url} failed, unmarshal response failed, JSON is: ${body}`);
        }
        if (json.Code !== 'Success') {
            throw new Error(`Get credentials from ${url} failed, Code is ${json.Code}`);
        }
        this.sessionCredential = {
            AccessKeyId: json.AccessKeyId,
            AccessKeySecret: json.AccessKeySecret,
            Expiration: json.Expiration,
            SecurityToken: json.SecurityToken,
        };
    }
}
exports["default"] = URICredential;
//# sourceMappingURL=uri_credential.js.map

/***/ }),

/***/ 8524:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_CLIENT = exports.DEFAULT_UA = void 0;
const os = __importStar(__nccwpck_require__(2037));
const package_json_1 = __importDefault(__nccwpck_require__(9807));
exports.DEFAULT_UA = `AlibabaCloud (${os.platform()}; ${os.arch()}) ` +
    `Node.js/${process.version} Core/${package_json_1.default.version}`;
exports.DEFAULT_CLIENT = `Node.js(${process.version}), ${package_json_1.default.name}: ${package_json_1.default.version}`;
//# sourceMappingURL=helper.js.map

/***/ }),

/***/ 6050:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.request = void 0;
const httpx_1 = __importDefault(__nccwpck_require__(9074));
const kitx = __importStar(__nccwpck_require__(8683));
const helper = __importStar(__nccwpck_require__(8524));
const utils = __importStar(__nccwpck_require__(6517));
const STATUS_CODE = new Set([200, '200', 'OK', 'Success']);
function firstLetterUpper(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}
function formatParams(params) {
    const keys = Object.keys(params);
    const newParams = {};
    for (const key of keys) {
        newParams[firstLetterUpper(key)] = params[key];
    }
    return newParams;
}
function encode(str) {
    const result = encodeURIComponent(str);
    return result.replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}
function replaceRepeatList(target, key, repeat) {
    for (let i = 0; i < repeat.length; i++) {
        const item = repeat[i];
        if (item && typeof item === 'object') {
            const keys = Object.keys(item);
            for (const itemKey of keys) {
                target[`${key}.${i + 1}.${itemKey}`] = item[itemKey];
            }
        }
        else {
            target[`${key}.${i + 1}`] = item;
        }
    }
}
function flatParams(params) {
    const target = {};
    const keys = Object.keys(params);
    for (const key of keys) {
        const value = params[key];
        if (Array.isArray(value)) {
            replaceRepeatList(target, key, value);
        }
        else {
            target[key] = value;
        }
    }
    return target;
}
function normalize(params) {
    const list = [];
    const flated = flatParams(params);
    const keys = Object.keys(flated).sort();
    for (const key of keys) {
        const value = flated[key];
        list.push([encode(key), encode(value)]); // push []
    }
    return list;
}
function canonicalize(normalized) {
    const fields = [];
    for (const [key, value] of normalized) {
        fields.push(key + '=' + value);
    }
    return fields.join('&');
}
function _buildParams() {
    const defaultParams = {
        Format: 'JSON',
        SignatureMethod: 'HMAC-SHA1',
        SignatureNonce: kitx.makeNonce(),
        SignatureVersion: '1.0',
        Timestamp: utils.timestamp(),
        Version: '2015-04-01',
        RegionId: 'cn-hangzhou'
    };
    return defaultParams;
}
async function request(host, params = {}, opts = {}, accessKeySecret) {
    // 1. compose params and opts
    let options = Object.assign({ headers: {
            'x-sdk-client': helper.DEFAULT_CLIENT,
            'user-agent': helper.DEFAULT_UA
        } }, opts);
    // format params until formatParams is false
    if (options.formatParams !== false) {
        params = formatParams(params);
    }
    params = Object.assign(Object.assign({}, _buildParams()), params);
    // 2. calculate signature
    const method = (opts.method || 'GET').toUpperCase();
    const normalized = normalize(params);
    const canonicalized = canonicalize(normalized);
    // 2.1 get string to sign
    const stringToSign = `${method}&${encode('/')}&${encode(canonicalized)}`;
    // 2.2 get signature
    const key = accessKeySecret + '&';
    const signature = kitx.sha1(stringToSign, key, 'base64');
    // add signature
    normalized.push(['Signature', encode(signature)]);
    // 3. generate final url
    const url = opts.method === 'POST' ? `${host}/` : `${host}/?${canonicalize(normalized)}`;
    // 4. send request
    if (opts.method === 'POST') {
        opts.headers = opts.headers || {};
        opts.headers['content-type'] = 'application/x-www-form-urlencoded';
        opts.data = canonicalize(normalized);
    }
    const response = await httpx_1.default.request(url, opts);
    const buffer = await httpx_1.default.read(response, 'utf8');
    const json = JSON.parse(buffer);
    if (json.Code && !STATUS_CODE.has(json.Code)) {
        const err = new Error(`${json.Message}`);
        err.name = json.Code + 'Error';
        err.data = json;
        err.code = json.Code;
        err.url = url;
        throw err;
    }
    return json;
}
exports.request = request;
//# sourceMappingURL=http.js.map

/***/ }),

/***/ 6517:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseFile = exports.timestamp = void 0;
const ini = __importStar(__nccwpck_require__(8885));
const kitx = __importStar(__nccwpck_require__(8683));
const fs_1 = __importDefault(__nccwpck_require__(7147));
function timestamp(dateStr, timeChange) {
    let date = new Date(dateStr);
    if (!dateStr || isNaN(date.getTime())) {
        date = new Date();
    }
    if (timeChange) {
        date.setTime(date.getTime() + timeChange);
    }
    const YYYY = date.getUTCFullYear();
    const MM = kitx.pad2(date.getUTCMonth() + 1);
    const DD = kitx.pad2(date.getUTCDate());
    const HH = kitx.pad2(date.getUTCHours());
    const mm = kitx.pad2(date.getUTCMinutes());
    const ss = kitx.pad2(date.getUTCSeconds());
    // 删除掉毫秒部分
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
}
exports.timestamp = timestamp;
function parseFile(file, ignoreErr = false) {
    // check read permission
    try {
        fs_1.default.accessSync(file, fs_1.default.constants.R_OK);
    }
    catch (e) {
        if (ignoreErr) {
            return null;
        }
        throw new Error('Has no read permission to credentials file');
    }
    return ini.parse(fs_1.default.readFileSync(file, 'utf-8'));
}
exports.parseFile = parseFile;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 2306:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.getEndpointRules = function (product, regionId, endpointType, network, suffix) {
        var result;
        if (network && network.length && network != "public") {
            network = "-" + network;
        }
        else {
            network = "";
        }
        suffix = suffix || "";
        if (suffix.length) {
            suffix = "-" + suffix;
        }
        if (endpointType == "regional") {
            if (!regionId || !regionId.length) {
                throw new Error("RegionId is empty, please set a valid RegionId");
            }
            result = "" + product + suffix + network + "." + regionId + ".aliyuncs.com";
        }
        else {
            result = "" + product + suffix + network + ".aliyuncs.com";
        }
        return result;
    };
    return Client;
}());
exports["default"] = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 2652:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InterceptorContextResponse = exports.InterceptorContextConfiguration = exports.InterceptorContextRequest = exports.AttributeMap = exports.InterceptorContext = void 0;
// This file is auto-generated, don't edit it
const credentials_1 = __importDefault(__nccwpck_require__(4060));
const $tea = __importStar(__nccwpck_require__(4165));
class InterceptorContext extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            request: 'request',
            configuration: 'configuration',
            response: 'response',
        };
    }
    static types() {
        return {
            request: InterceptorContextRequest,
            configuration: InterceptorContextConfiguration,
            response: InterceptorContextResponse,
        };
    }
}
exports.InterceptorContext = InterceptorContext;
class AttributeMap extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            attributes: 'attributes',
            key: 'key',
        };
    }
    static types() {
        return {
            attributes: { 'type': 'map', 'keyType': 'string', 'valueType': 'any' },
            key: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
        };
    }
}
exports.AttributeMap = AttributeMap;
class InterceptorContextRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            query: 'query',
            body: 'body',
            stream: 'stream',
            hostMap: 'hostMap',
            pathname: 'pathname',
            productId: 'productId',
            action: 'action',
            version: 'version',
            protocol: 'protocol',
            method: 'method',
            authType: 'authType',
            bodyType: 'bodyType',
            reqBodyType: 'reqBodyType',
            style: 'style',
            credential: 'credential',
            signatureVersion: 'signatureVersion',
            signatureAlgorithm: 'signatureAlgorithm',
            userAgent: 'userAgent',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            query: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: 'any',
            stream: 'Readable',
            hostMap: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            pathname: 'string',
            productId: 'string',
            action: 'string',
            version: 'string',
            protocol: 'string',
            method: 'string',
            authType: 'string',
            bodyType: 'string',
            reqBodyType: 'string',
            style: 'string',
            credential: credentials_1.default,
            signatureVersion: 'string',
            signatureAlgorithm: 'string',
            userAgent: 'string',
        };
    }
}
exports.InterceptorContextRequest = InterceptorContextRequest;
class InterceptorContextConfiguration extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            regionId: 'regionId',
            endpoint: 'endpoint',
            endpointRule: 'endpointRule',
            endpointMap: 'endpointMap',
            endpointType: 'endpointType',
            network: 'network',
            suffix: 'suffix',
        };
    }
    static types() {
        return {
            regionId: 'string',
            endpoint: 'string',
            endpointRule: 'string',
            endpointMap: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            endpointType: 'string',
            network: 'string',
            suffix: 'string',
        };
    }
}
exports.InterceptorContextConfiguration = InterceptorContextConfiguration;
class InterceptorContextResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            statusCode: 'statusCode',
            headers: 'headers',
            body: 'body',
            deserializedBody: 'deserializedBody',
        };
    }
    static types() {
        return {
            statusCode: 'number',
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: 'Readable',
            deserializedBody: 'any',
        };
    }
}
exports.InterceptorContextResponse = InterceptorContextResponse;
class Client {
    constructor() {
    }
}
exports["default"] = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 6642:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Params = exports.OpenApiRequest = exports.Config = exports.GlobalParameters = void 0;
// This file is auto-generated, don't edit it
/**
 * This is for OpenApi SDK
 */
const tea_util_1 = __importDefault(__nccwpck_require__(1979));
const credentials_1 = __importStar(__nccwpck_require__(4060)), $Credential = credentials_1;
const openapi_util_1 = __importDefault(__nccwpck_require__(8190));
const $SPI = __importStar(__nccwpck_require__(2652));
const tea_xml_1 = __importDefault(__nccwpck_require__(5757));
const $tea = __importStar(__nccwpck_require__(4165));
class GlobalParameters extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            queries: 'queries',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            queries: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
        };
    }
}
exports.GlobalParameters = GlobalParameters;
/**
 * Model for initing client
 */
class Config extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accessKeyId: 'accessKeyId',
            accessKeySecret: 'accessKeySecret',
            securityToken: 'securityToken',
            protocol: 'protocol',
            method: 'method',
            regionId: 'regionId',
            readTimeout: 'readTimeout',
            connectTimeout: 'connectTimeout',
            httpProxy: 'httpProxy',
            httpsProxy: 'httpsProxy',
            credential: 'credential',
            endpoint: 'endpoint',
            noProxy: 'noProxy',
            maxIdleConns: 'maxIdleConns',
            network: 'network',
            userAgent: 'userAgent',
            suffix: 'suffix',
            socks5Proxy: 'socks5Proxy',
            socks5NetWork: 'socks5NetWork',
            endpointType: 'endpointType',
            openPlatformEndpoint: 'openPlatformEndpoint',
            type: 'type',
            signatureVersion: 'signatureVersion',
            signatureAlgorithm: 'signatureAlgorithm',
            globalParameters: 'globalParameters',
        };
    }
    static types() {
        return {
            accessKeyId: 'string',
            accessKeySecret: 'string',
            securityToken: 'string',
            protocol: 'string',
            method: 'string',
            regionId: 'string',
            readTimeout: 'number',
            connectTimeout: 'number',
            httpProxy: 'string',
            httpsProxy: 'string',
            credential: credentials_1.default,
            endpoint: 'string',
            noProxy: 'string',
            maxIdleConns: 'number',
            network: 'string',
            userAgent: 'string',
            suffix: 'string',
            socks5Proxy: 'string',
            socks5NetWork: 'string',
            endpointType: 'string',
            openPlatformEndpoint: 'string',
            type: 'string',
            signatureVersion: 'string',
            signatureAlgorithm: 'string',
            globalParameters: GlobalParameters,
        };
    }
}
exports.Config = Config;
class OpenApiRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            query: 'query',
            body: 'body',
            stream: 'stream',
            hostMap: 'hostMap',
            endpointOverride: 'endpointOverride',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            query: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: 'any',
            stream: 'Readable',
            hostMap: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            endpointOverride: 'string',
        };
    }
}
exports.OpenApiRequest = OpenApiRequest;
class Params extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            action: 'action',
            version: 'version',
            protocol: 'protocol',
            pathname: 'pathname',
            method: 'method',
            authType: 'authType',
            bodyType: 'bodyType',
            reqBodyType: 'reqBodyType',
            style: 'style',
        };
    }
    static types() {
        return {
            action: 'string',
            version: 'string',
            protocol: 'string',
            pathname: 'string',
            method: 'string',
            authType: 'string',
            bodyType: 'string',
            reqBodyType: 'string',
            style: 'string',
        };
    }
}
exports.Params = Params;
class Client {
    /**
     * Init client with Config
     * @param config config contains the necessary information to create a client
     */
    constructor(config) {
        if (tea_util_1.default.isUnset($tea.toMap(config))) {
            throw $tea.newError({
                code: "ParameterMissing",
                message: "'config' can not be unset",
            });
        }
        if (!tea_util_1.default.empty(config.accessKeyId) && !tea_util_1.default.empty(config.accessKeySecret)) {
            if (!tea_util_1.default.empty(config.securityToken)) {
                config.type = "sts";
            }
            else {
                config.type = "access_key";
            }
            let credentialConfig = new $Credential.Config({
                accessKeyId: config.accessKeyId,
                type: config.type,
                accessKeySecret: config.accessKeySecret,
            });
            credentialConfig.securityToken = config.securityToken;
            this._credential = new credentials_1.default(credentialConfig);
        }
        else if (!tea_util_1.default.isUnset(config.credential)) {
            this._credential = config.credential;
        }
        this._endpoint = config.endpoint;
        this._endpointType = config.endpointType;
        this._network = config.network;
        this._suffix = config.suffix;
        this._protocol = config.protocol;
        this._method = config.method;
        this._regionId = config.regionId;
        this._userAgent = config.userAgent;
        this._readTimeout = config.readTimeout;
        this._connectTimeout = config.connectTimeout;
        this._httpProxy = config.httpProxy;
        this._httpsProxy = config.httpsProxy;
        this._noProxy = config.noProxy;
        this._socks5Proxy = config.socks5Proxy;
        this._socks5NetWork = config.socks5NetWork;
        this._maxIdleConns = config.maxIdleConns;
        this._signatureVersion = config.signatureVersion;
        this._signatureAlgorithm = config.signatureAlgorithm;
        this._globalParameters = config.globalParameters;
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doRPCRequest(action, version, protocol, method, authType, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            socks5Proxy: tea_util_1.default.defaultString(runtime.socks5Proxy, this._socks5Proxy),
            socks5NetWork: tea_util_1.default.defaultString(runtime.socks5NetWork, this._socks5NetWork),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = "/";
                let globalQueries = {};
                let globalHeaders = {};
                if (!tea_util_1.default.isUnset($tea.toMap(this._globalParameters))) {
                    let globalParams = this._globalParameters;
                    if (!tea_util_1.default.isUnset(globalParams.queries)) {
                        globalQueries = globalParams.queries;
                    }
                    if (!tea_util_1.default.isUnset(globalParams.headers)) {
                        globalHeaders = globalParams.headers;
                    }
                }
                request_.query = Object.assign(Object.assign({ Action: action, Format: "json", Version: version, Timestamp: openapi_util_1.default.getTimestamp(), SignatureNonce: tea_util_1.default.getNonce() }, globalQueries), request.query);
                let headers = this.getRpcHeaders();
                if (tea_util_1.default.isUnset(headers)) {
                    // endpoint is setted in product client
                    request_.headers = Object.assign({ host: this._endpoint, 'x-acs-version': version, 'x-acs-action': action, 'user-agent': this.getUserAgent() }, globalHeaders);
                }
                else {
                    request_.headers = Object.assign(Object.assign({ host: this._endpoint, 'x-acs-version': version, 'x-acs-action': action, 'user-agent': this.getUserAgent() }, globalHeaders), headers);
                }
                if (!tea_util_1.default.isUnset(request.body)) {
                    let m = tea_util_1.default.assertAsMap(request.body);
                    let tmp = tea_util_1.default.anyifyMapValue(openapi_util_1.default.query(m));
                    request_.body = new $tea.BytesReadable(tea_util_1.default.toFormString(tmp));
                    request_.headers["content-type"] = "application/x-www-form-urlencoded";
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.query["SecurityToken"] = securityToken;
                    }
                    request_.query["SignatureMethod"] = "HMAC-SHA1";
                    request_.query["SignatureVersion"] = "1.0";
                    request_.query["AccessKeyId"] = accessKeyId;
                    let t = null;
                    if (!tea_util_1.default.isUnset(request.body)) {
                        t = tea_util_1.default.assertAsMap(request.body);
                    }
                    let signedParam = Object.assign(Object.assign({}, request_.query), openapi_util_1.default.query(t));
                    request_.query["Signature"] = openapi_util_1.default.getRPCSignature(signedParam, request_.method, accessKeySecret);
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    let requestId = Client.defaultAny(err["RequestId"], err["requestId"]);
                    err["statusCode"] = response_.statusCode;
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${requestId}`,
                        data: err,
                        description: `${Client.defaultAny(err["Description"], err["description"])}`,
                        accessDeniedDetail: err["AccessDeniedDetail"],
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param pathname pathname of every api
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doROARequest(action, version, protocol, method, authType, pathname, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            socks5Proxy: tea_util_1.default.defaultString(runtime.socks5Proxy, this._socks5Proxy),
            socks5NetWork: tea_util_1.default.defaultString(runtime.socks5NetWork, this._socks5NetWork),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = pathname;
                let globalQueries = {};
                let globalHeaders = {};
                if (!tea_util_1.default.isUnset($tea.toMap(this._globalParameters))) {
                    let globalParams = this._globalParameters;
                    if (!tea_util_1.default.isUnset(globalParams.queries)) {
                        globalQueries = globalParams.queries;
                    }
                    if (!tea_util_1.default.isUnset(globalParams.headers)) {
                        globalHeaders = globalParams.headers;
                    }
                }
                request_.headers = Object.assign(Object.assign({ date: tea_util_1.default.getDateUTCString(), host: this._endpoint, accept: "application/json", 'x-acs-signature-nonce': tea_util_1.default.getNonce(), 'x-acs-signature-method': "HMAC-SHA1", 'x-acs-signature-version': "1.0", 'x-acs-version': version, 'x-acs-action': action, 'user-agent': tea_util_1.default.getUserAgent(this._userAgent) }, globalHeaders), request.headers);
                if (!tea_util_1.default.isUnset(request.body)) {
                    request_.body = new $tea.BytesReadable(tea_util_1.default.toJSONString(request.body));
                    request_.headers["content-type"] = "application/json; charset=utf-8";
                }
                request_.query = globalQueries;
                if (!tea_util_1.default.isUnset(request.query)) {
                    request_.query = Object.assign(Object.assign({}, request_.query), request.query);
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.headers["x-acs-accesskey-id"] = accessKeyId;
                        request_.headers["x-acs-security-token"] = securityToken;
                    }
                    let stringToSign = openapi_util_1.default.getStringToSign(request_);
                    request_.headers["authorization"] = `acs ${accessKeyId}:${openapi_util_1.default.getROASignature(stringToSign, accessKeySecret)}`;
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.equalNumber(response_.statusCode, 204)) {
                    return {
                        headers: response_.headers,
                    };
                }
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    let requestId = Client.defaultAny(err["RequestId"], err["requestId"]);
                    requestId = Client.defaultAny(requestId, err["requestid"]);
                    err["statusCode"] = response_.statusCode;
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${requestId}`,
                        data: err,
                        description: `${Client.defaultAny(err["Description"], err["description"])}`,
                        accessDeniedDetail: err["AccessDeniedDetail"],
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network with form body
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param pathname pathname of every api
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doROARequestWithForm(action, version, protocol, method, authType, pathname, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            socks5Proxy: tea_util_1.default.defaultString(runtime.socks5Proxy, this._socks5Proxy),
            socks5NetWork: tea_util_1.default.defaultString(runtime.socks5NetWork, this._socks5NetWork),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = pathname;
                let globalQueries = {};
                let globalHeaders = {};
                if (!tea_util_1.default.isUnset($tea.toMap(this._globalParameters))) {
                    let globalParams = this._globalParameters;
                    if (!tea_util_1.default.isUnset(globalParams.queries)) {
                        globalQueries = globalParams.queries;
                    }
                    if (!tea_util_1.default.isUnset(globalParams.headers)) {
                        globalHeaders = globalParams.headers;
                    }
                }
                request_.headers = Object.assign(Object.assign({ date: tea_util_1.default.getDateUTCString(), host: this._endpoint, accept: "application/json", 'x-acs-signature-nonce': tea_util_1.default.getNonce(), 'x-acs-signature-method': "HMAC-SHA1", 'x-acs-signature-version': "1.0", 'x-acs-version': version, 'x-acs-action': action, 'user-agent': tea_util_1.default.getUserAgent(this._userAgent) }, globalHeaders), request.headers);
                if (!tea_util_1.default.isUnset(request.body)) {
                    let m = tea_util_1.default.assertAsMap(request.body);
                    request_.body = new $tea.BytesReadable(openapi_util_1.default.toForm(m));
                    request_.headers["content-type"] = "application/x-www-form-urlencoded";
                }
                request_.query = globalQueries;
                if (!tea_util_1.default.isUnset(request.query)) {
                    request_.query = Object.assign(Object.assign({}, request_.query), request.query);
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.headers["x-acs-accesskey-id"] = accessKeyId;
                        request_.headers["x-acs-security-token"] = securityToken;
                    }
                    let stringToSign = openapi_util_1.default.getStringToSign(request_);
                    request_.headers["authorization"] = `acs ${accessKeyId}:${openapi_util_1.default.getROASignature(stringToSign, accessKeySecret)}`;
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.equalNumber(response_.statusCode, 204)) {
                    return {
                        headers: response_.headers,
                    };
                }
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    err["statusCode"] = response_.statusCode;
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${Client.defaultAny(err["RequestId"], err["requestId"])}`,
                        data: err,
                        description: `${Client.defaultAny(err["Description"], err["description"])}`,
                        accessDeniedDetail: err["AccessDeniedDetail"],
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doRequest(params, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            socks5Proxy: tea_util_1.default.defaultString(runtime.socks5Proxy, this._socks5Proxy),
            socks5NetWork: tea_util_1.default.defaultString(runtime.socks5NetWork, this._socks5NetWork),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, params.protocol);
                request_.method = params.method;
                request_.pathname = params.pathname;
                let globalQueries = {};
                let globalHeaders = {};
                if (!tea_util_1.default.isUnset($tea.toMap(this._globalParameters))) {
                    let globalParams = this._globalParameters;
                    if (!tea_util_1.default.isUnset(globalParams.queries)) {
                        globalQueries = globalParams.queries;
                    }
                    if (!tea_util_1.default.isUnset(globalParams.headers)) {
                        globalHeaders = globalParams.headers;
                    }
                }
                request_.query = Object.assign(Object.assign({}, globalQueries), request.query);
                // endpoint is setted in product client
                request_.headers = Object.assign(Object.assign({ host: this._endpoint, 'x-acs-version': params.version, 'x-acs-action': params.action, 'user-agent': this.getUserAgent(), 'x-acs-date': openapi_util_1.default.getTimestamp(), 'x-acs-signature-nonce': tea_util_1.default.getNonce(), accept: "application/json" }, globalHeaders), request.headers);
                if (tea_util_1.default.equalString(params.style, "RPC")) {
                    let headers = this.getRpcHeaders();
                    if (!tea_util_1.default.isUnset(headers)) {
                        request_.headers = Object.assign(Object.assign({}, request_.headers), headers);
                    }
                }
                let signatureAlgorithm = tea_util_1.default.defaultString(this._signatureAlgorithm, "ACS3-HMAC-SHA256");
                let hashedRequestPayload = openapi_util_1.default.hexEncode(openapi_util_1.default.hash(tea_util_1.default.toBytes(""), signatureAlgorithm));
                if (!tea_util_1.default.isUnset(request.stream)) {
                    let tmp = await tea_util_1.default.readAsBytes(request.stream);
                    hashedRequestPayload = openapi_util_1.default.hexEncode(openapi_util_1.default.hash(tmp, signatureAlgorithm));
                    request_.body = new $tea.BytesReadable(tmp);
                    request_.headers["content-type"] = "application/octet-stream";
                }
                else {
                    if (!tea_util_1.default.isUnset(request.body)) {
                        if (tea_util_1.default.equalString(params.reqBodyType, "json")) {
                            let jsonObj = tea_util_1.default.toJSONString(request.body);
                            hashedRequestPayload = openapi_util_1.default.hexEncode(openapi_util_1.default.hash(tea_util_1.default.toBytes(jsonObj), signatureAlgorithm));
                            request_.body = new $tea.BytesReadable(jsonObj);
                            request_.headers["content-type"] = "application/json; charset=utf-8";
                        }
                        else {
                            let m = tea_util_1.default.assertAsMap(request.body);
                            let formObj = openapi_util_1.default.toForm(m);
                            hashedRequestPayload = openapi_util_1.default.hexEncode(openapi_util_1.default.hash(tea_util_1.default.toBytes(formObj), signatureAlgorithm));
                            request_.body = new $tea.BytesReadable(formObj);
                            request_.headers["content-type"] = "application/x-www-form-urlencoded";
                        }
                    }
                }
                request_.headers["x-acs-content-sha256"] = hashedRequestPayload;
                if (!tea_util_1.default.equalString(params.authType, "Anonymous")) {
                    let authType = await this.getType();
                    if (tea_util_1.default.equalString(authType, "bearer")) {
                        let bearerToken = await this.getBearerToken();
                        request_.headers["x-acs-bearer-token"] = bearerToken;
                    }
                    else {
                        let accessKeyId = await this.getAccessKeyId();
                        let accessKeySecret = await this.getAccessKeySecret();
                        let securityToken = await this.getSecurityToken();
                        if (!tea_util_1.default.empty(securityToken)) {
                            request_.headers["x-acs-accesskey-id"] = accessKeyId;
                            request_.headers["x-acs-security-token"] = securityToken;
                        }
                        request_.headers["Authorization"] = openapi_util_1.default.getAuthorization(request_, signatureAlgorithm, hashedRequestPayload, accessKeyId, accessKeySecret);
                    }
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let err = {};
                    if (!tea_util_1.default.isUnset(response_.headers["content-type"]) && tea_util_1.default.equalString(response_.headers["content-type"], "text/xml;charset=utf-8")) {
                        let _str = await tea_util_1.default.readAsString(response_.body);
                        let respMap = tea_xml_1.default.parseXml(_str, null);
                        err = tea_util_1.default.assertAsMap(respMap["Error"]);
                    }
                    else {
                        let _res = await tea_util_1.default.readAsJSON(response_.body);
                        err = tea_util_1.default.assertAsMap(_res);
                    }
                    err["statusCode"] = response_.statusCode;
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${Client.defaultAny(err["RequestId"], err["requestId"])}`,
                        data: err,
                        description: `${Client.defaultAny(err["Description"], err["description"])}`,
                        accessDeniedDetail: err["AccessDeniedDetail"],
                    });
                }
                if (tea_util_1.default.equalString(params.bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(params.bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(params.bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(params.bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else if (tea_util_1.default.equalString(params.bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                        statusCode: response_.statusCode,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async execute(params, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            socks5Proxy: tea_util_1.default.defaultString(runtime.socks5Proxy, this._socks5Proxy),
            socks5NetWork: tea_util_1.default.defaultString(runtime.socks5NetWork, this._socks5NetWork),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                // spi = new Gateway();//Gateway implements SPI，这一步在产品 SDK 中实例化
                let headers = this.getRpcHeaders();
                let globalQueries = {};
                let globalHeaders = {};
                if (!tea_util_1.default.isUnset($tea.toMap(this._globalParameters))) {
                    let globalParams = this._globalParameters;
                    if (!tea_util_1.default.isUnset(globalParams.queries)) {
                        globalQueries = globalParams.queries;
                    }
                    if (!tea_util_1.default.isUnset(globalParams.headers)) {
                        globalHeaders = globalParams.headers;
                    }
                }
                let requestContext = new $SPI.InterceptorContextRequest({
                    headers: Object.assign(Object.assign(Object.assign({}, globalHeaders), request.headers), headers),
                    query: Object.assign(Object.assign({}, globalQueries), request.query),
                    body: request.body,
                    stream: request.stream,
                    hostMap: request.hostMap,
                    pathname: params.pathname,
                    productId: this._productId,
                    action: params.action,
                    version: params.version,
                    protocol: tea_util_1.default.defaultString(this._protocol, params.protocol),
                    method: tea_util_1.default.defaultString(this._method, params.method),
                    authType: params.authType,
                    bodyType: params.bodyType,
                    reqBodyType: params.reqBodyType,
                    style: params.style,
                    credential: this._credential,
                    signatureVersion: this._signatureVersion,
                    signatureAlgorithm: this._signatureAlgorithm,
                    userAgent: this.getUserAgent(),
                });
                let configurationContext = new $SPI.InterceptorContextConfiguration({
                    regionId: this._regionId,
                    endpoint: tea_util_1.default.defaultString(request.endpointOverride, this._endpoint),
                    endpointRule: this._endpointRule,
                    endpointMap: this._endpointMap,
                    endpointType: this._endpointType,
                    network: this._network,
                    suffix: this._suffix,
                });
                let interceptorContext = new $SPI.InterceptorContext({
                    request: requestContext,
                    configuration: configurationContext,
                });
                let attributeMap = new $SPI.AttributeMap({});
                // 1. spi.modifyConfiguration(context: SPI.InterceptorContext, attributeMap: SPI.AttributeMap);
                await this._spi.modifyConfiguration(interceptorContext, attributeMap);
                // 2. spi.modifyRequest(context: SPI.InterceptorContext, attributeMap: SPI.AttributeMap);
                await this._spi.modifyRequest(interceptorContext, attributeMap);
                request_.protocol = interceptorContext.request.protocol;
                request_.method = interceptorContext.request.method;
                request_.pathname = interceptorContext.request.pathname;
                request_.query = interceptorContext.request.query;
                request_.body = interceptorContext.request.stream;
                request_.headers = interceptorContext.request.headers;
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                let responseContext = new $SPI.InterceptorContextResponse({
                    statusCode: response_.statusCode,
                    headers: response_.headers,
                    body: response_.body,
                });
                interceptorContext.response = responseContext;
                // 3. spi.modifyResponse(context: SPI.InterceptorContext, attributeMap: SPI.AttributeMap);
                await this._spi.modifyResponse(interceptorContext, attributeMap);
                return {
                    headers: interceptorContext.response.headers,
                    statusCode: interceptorContext.response.statusCode,
                    body: interceptorContext.response.deserializedBody,
                };
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    async callApi(params, request, runtime) {
        if (tea_util_1.default.isUnset($tea.toMap(params))) {
            throw $tea.newError({
                code: "ParameterMissing",
                message: "'params' can not be unset",
            });
        }
        if (tea_util_1.default.isUnset(this._signatureAlgorithm) || !tea_util_1.default.equalString(this._signatureAlgorithm, "v2")) {
            return await this.doRequest(params, request, runtime);
        }
        else if (tea_util_1.default.equalString(params.style, "ROA") && tea_util_1.default.equalString(params.reqBodyType, "json")) {
            return await this.doROARequest(params.action, params.version, params.protocol, params.method, params.authType, params.pathname, params.bodyType, request, runtime);
        }
        else if (tea_util_1.default.equalString(params.style, "ROA")) {
            return await this.doROARequestWithForm(params.action, params.version, params.protocol, params.method, params.authType, params.pathname, params.bodyType, request, runtime);
        }
        else {
            return await this.doRPCRequest(params.action, params.version, params.protocol, params.method, params.authType, params.bodyType, request, runtime);
        }
    }
    /**
     * Get user agent
     * @return user agent
     */
    getUserAgent() {
        let userAgent = tea_util_1.default.getUserAgent(this._userAgent);
        return userAgent;
    }
    /**
     * Get accesskey id by using credential
     * @return accesskey id
     */
    async getAccessKeyId() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let accessKeyId = await this._credential.getAccessKeyId();
        return accessKeyId;
    }
    /**
     * Get accesskey secret by using credential
     * @return accesskey secret
     */
    async getAccessKeySecret() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let secret = await this._credential.getAccessKeySecret();
        return secret;
    }
    /**
     * Get security token by using credential
     * @return security token
     */
    async getSecurityToken() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let token = await this._credential.getSecurityToken();
        return token;
    }
    /**
     * Get bearer token by credential
     * @return bearer token
     */
    async getBearerToken() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let token = this._credential.getBearerToken();
        return token;
    }
    /**
     * Get credential type by credential
     * @return credential type e.g. access_key
     */
    async getType() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let authType = this._credential.getType();
        return authType;
    }
    /**
     * If inputValue is not null, return it or return defaultValue
     * @param inputValue  users input value
     * @param defaultValue default value
     * @return the final result
     */
    static defaultAny(inputValue, defaultValue) {
        if (tea_util_1.default.isUnset(inputValue)) {
            return defaultValue;
        }
        return inputValue;
    }
    /**
     * If the endpointRule and config.endpoint are empty, throw error
     * @param config config contains the necessary information to create a client
     */
    checkConfig(config) {
        if (tea_util_1.default.empty(this._endpointRule) && tea_util_1.default.empty(config.endpoint)) {
            throw $tea.newError({
                code: "ParameterMissing",
                message: "'config.endpoint' can not be empty",
            });
        }
    }
    /**
     * set RPC header for debug
     * @param headers headers for debug, this header can be used only once.
     */
    setRpcHeaders(headers) {
        this._headers = headers;
    }
    /**
     * get RPC header for debug
     */
    getRpcHeaders() {
        let headers = this._headers;
        this._headers = null;
        return headers;
    }
}
exports["default"] = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 8190:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// This file is auto-generated, don't edit it
/**
 * This is for OpenApi Util
 */
const $tea = __importStar(__nccwpck_require__(4165));
const tea_util_1 = __importDefault(__nccwpck_require__(1979));
const kitx_1 = __importDefault(__nccwpck_require__(8683));
const querystring_1 = __importDefault(__nccwpck_require__(3477));
const crypto_1 = __importDefault(__nccwpck_require__(6113));
const PEM_BEGIN = "-----BEGIN PRIVATE KEY-----\n";
const PEM_END = "\n-----END PRIVATE KEY-----";
function replaceRepeatList(target, repeat, prefix) {
    if (prefix) {
        prefix = prefix + '.';
    }
    for (var i = 0; i < repeat.length; i++) {
        var item = repeat[i];
        let key = prefix + (i + 1);
        if (typeof item === 'undefined' || item == null) {
            continue;
        }
        if (Array.isArray(item)) {
            replaceRepeatList(target, item, key);
        }
        else if (item instanceof Object) {
            flatMap(target, item, key);
        }
        else {
            target[key] = item.toString();
        }
    }
}
function flatMap(target, params, prefix = '') {
    if (prefix) {
        prefix = prefix + '.';
    }
    params = toMap(params);
    let keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = params[key];
        key = prefix + key;
        if (typeof value === 'undefined' || value == null) {
            continue;
        }
        if (Array.isArray(value)) {
            replaceRepeatList(target, value, key);
        }
        else if (value instanceof Object) {
            flatMap(target, value, key);
        }
        else {
            target[key] = value.toString();
        }
    }
    return target;
}
function filter(value) {
    return value.replace(/[\t\n\r\f]/g, ' ');
}
function getCanonicalizedHeaders(headers) {
    const prefix = 'x-acs-';
    const keys = Object.keys(headers);
    const canonicalizedKeys = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.startsWith(prefix)) {
            canonicalizedKeys.push(key);
        }
    }
    canonicalizedKeys.sort();
    var result = '';
    for (let i = 0; i < canonicalizedKeys.length; i++) {
        const key = canonicalizedKeys[i];
        result += `${key}:${filter(headers[key]).trim()}\n`;
    }
    return result;
}
function getCanonicalizedResource(uriPattern, query) {
    const keys = !query ? [] : Object.keys(query).sort();
    if (keys.length === 0) {
        return uriPattern;
    }
    var result = [];
    for (var i = 0; i < keys.length; i++) {
        const key = keys[i];
        result.push(`${key}=${query[key]}`);
    }
    return `${uriPattern}?${result.join('&')}`;
}
function getAuthorizationQueryString(query) {
    let canonicalQueryArray = [];
    const keys = !query ? [] : Object.keys(query).sort();
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let param = key + '=';
        if (typeof query[key] !== 'undefined' && query[key] !== null) {
            param = param + encode(query[key]);
        }
        canonicalQueryArray.push(param);
    }
    return canonicalQueryArray.join('&');
}
function getAuthorizationHeaders(header) {
    let canonicalheaders = "";
    let tmp = {};
    const keys = !header ? [] : Object.keys(header);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const lowerKey = keys[i].toLowerCase();
        if (lowerKey.startsWith("x-acs-") || lowerKey === "host" || lowerKey === "content-type") {
            if (tmp[lowerKey]) {
                tmp[lowerKey].push((header[key] || "").trim());
            }
            else {
                tmp[lowerKey] = [(header[key] || "").trim()];
            }
        }
    }
    var hsKeys = Object.keys(tmp).sort();
    for (let i = 0; i < hsKeys.length; i++) {
        const hsKey = hsKeys[i];
        let listSort = tmp[hsKey].sort();
        canonicalheaders += `${hsKey}:${listSort.join(",")}\n`;
    }
    return { canonicalheaders, hsKeys };
}
function encode(str) {
    var result = encodeURIComponent(str);
    return result.replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}
function normalize(params) {
    var list = [];
    var flated = {};
    flatMap(flated, params);
    var keys = Object.keys(flated).sort();
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = flated[key];
        list.push([encode(key), encode(value)]);
    }
    return list;
}
function canonicalize(normalized) {
    var fields = [];
    for (var i = 0; i < normalized.length; i++) {
        var [key, value] = normalized[i];
        fields.push(key + '=' + value);
    }
    return fields.join('&');
}
function isModelClass(t) {
    if (!t) {
        return false;
    }
    return typeof t.types === 'function' && typeof t.names === 'function';
}
function isObjectOrArray(t) {
    return Array.isArray(t) || (t instanceof Object && typeof t !== 'function');
}
function toMap(input) {
    if (!isObjectOrArray(input)) {
        return null;
    }
    else if (input instanceof $tea.Model) {
        return $tea.toMap(input);
    }
    else if (input && input.toMap && typeof input.toMap === 'function') {
        // 解决跨版本 Model 不互认的问题
        return input.toMap();
    }
    else if (Array.isArray(input)) {
        const result = [];
        input.forEach((value) => {
            if (isObjectOrArray(value)) {
                result.push(toMap(value));
            }
            else {
                result.push(value);
            }
        });
        return result;
    }
    else if (input instanceof Object) {
        const result = {};
        Object.entries(input).forEach(([key, value]) => {
            if (isObjectOrArray(value)) {
                result[key] = toMap(value);
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }
}
class Client {
    /**
     * Convert all params of body other than type of readable into content
     * @param input source Model
     * @param output target Model
     * @return void
     */
    static convert(input, output) {
        if (!output) {
            return;
        }
        let inputModel = Object.assign({}, input);
        let constructor = output.constructor;
        let types = constructor.types();
        // let constructor = <any>output.constructor;
        for (let key of Object.keys(constructor.names())) {
            if (inputModel[key]) {
                if (isModelClass(types[key])) {
                    output[key] = new types[key](output[key]);
                    Client.convert(inputModel[key], output[key]);
                    continue;
                }
                output[key] = inputModel[key];
            }
        }
    }
    /**
     * Get the string to be signed according to request
     * @param request  which contains signed messages
     * @return the signed string
     */
    static getStringToSign(request) {
        const method = request.method;
        const accept = request.headers['accept'];
        const contentMD5 = request.headers['content-md5'] || '';
        const contentType = request.headers['content-type'] || '';
        const date = request.headers['date'] || '';
        const header = `${method}\n${accept}\n${contentMD5}\n${contentType}\n${date}\n`;
        const canonicalizedHeaders = getCanonicalizedHeaders(request.headers);
        const canonicalizedResource = getCanonicalizedResource(request.pathname, request.query);
        return `${header}${canonicalizedHeaders}${canonicalizedResource}`;
    }
    /**
     * Get signature according to stringToSign, secret
     * @param stringToSign  the signed string
     * @param secret accesskey secret
     * @return the signature
     */
    static getROASignature(stringToSign, secret) {
        const utf8Buff = Buffer.from(stringToSign, 'utf8');
        return kitx_1.default.sha1(utf8Buff, secret, 'base64');
    }
    /**
     * Parse filter into a form string
     * @param filter object
     * @return the string
     */
    static toForm(filter) {
        if (!filter) {
            return '';
        }
        let target = {};
        flatMap(target, filter);
        return tea_util_1.default.toFormString(target);
    }
    /**
     * Get timestamp
     * @return the timestamp string
     */
    static getTimestamp() {
        let date = new Date();
        let YYYY = date.getUTCFullYear();
        let MM = kitx_1.default.pad2(date.getUTCMonth() + 1);
        let DD = kitx_1.default.pad2(date.getUTCDate());
        let HH = kitx_1.default.pad2(date.getUTCHours());
        let mm = kitx_1.default.pad2(date.getUTCMinutes());
        let ss = kitx_1.default.pad2(date.getUTCSeconds());
        return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
    }
    /**
     * Parse filter into a object which's type is map[string]string
     * @param filter query param
     * @return the object
     */
    static query(filter) {
        if (!filter) {
            return {};
        }
        let ret = {};
        flatMap(ret, filter);
        return ret;
    }
    /**
     * Get signature according to signedParams, method and secret
     * @param signedParams params which need to be signed
     * @param method http method e.g. GET
     * @param secret AccessKeySecret
     * @return the signature
     */
    static getRPCSignature(signedParams, method, secret) {
        var normalized = normalize(signedParams);
        var canonicalized = canonicalize(normalized);
        var stringToSign = `${method}&${encode('/')}&${encode(canonicalized)}`;
        const key = secret + '&';
        return kitx_1.default.sha1(stringToSign, key, 'base64');
    }
    /**
     * Parse array into a string with specified style
     * @param array the array
     * @param prefix the prefix string
     * @style specified style e.g. repeatList
     * @return the string
     */
    static arrayToStringWithSpecifiedStyle(array, prefix, style) {
        if (!array) {
            return '';
        }
        if (style === 'repeatList') {
            let target = {};
            replaceRepeatList(target, array, prefix);
            return querystring_1.default.stringify(target, '&&');
        }
        else if (style === 'json') {
            return JSON.stringify(array);
        }
        else if (style === 'simple') {
            return array.join(',');
        }
        else if (style === 'spaceDelimited') {
            return array.join(' ');
        }
        else if (style === 'pipeDelimited') {
            return array.join('|');
        }
        else {
            return '';
        }
    }
    /**
     * Transform input as map.
     */
    static parseToMap(input) {
        return toMap(input);
    }
    static getEndpoint(endpoint, serverUse, endpointType) {
        if (endpointType == "internal") {
            let strs = endpoint.split(".");
            strs[0] += "-internal";
            endpoint = strs.join(".");
        }
        if (serverUse && endpointType == "accelerate") {
            return "oss-accelerate.aliyuncs.com";
        }
        return endpoint;
    }
    /**
    * Encode raw with base16
    * @param raw encoding data
    * @return encoded string
    */
    static hexEncode(raw) {
        return raw.toString("hex");
    }
    /**
     * Hash the raw data with signatureAlgorithm
     * @param raw hashing data
     * @param signatureAlgorithm the autograph method
     * @return hashed bytes
    */
    static hash(raw, signatureAlgorithm) {
        if (signatureAlgorithm === "ACS3-HMAC-SHA256" || signatureAlgorithm === "ACS3-RSA-SHA256") {
            const obj = crypto_1.default.createHash('sha256');
            obj.update(raw);
            return obj.digest();
        }
        else if (signatureAlgorithm == "ACS3-HMAC-SM3") {
            const obj = crypto_1.default.createHash('sm3');
            obj.update(raw);
            return obj.digest();
        }
    }
    static signatureMethod(secret, source, signatureAlgorithm) {
        if (signatureAlgorithm === "ACS3-HMAC-SHA256") {
            const obj = crypto_1.default.createHmac('sha256', secret);
            obj.update(source);
            return obj.digest();
        }
        else if (signatureAlgorithm === "ACS3-HMAC-SM3") {
            const obj = crypto_1.default.createHmac('sm3', secret);
            obj.update(source);
            return obj.digest();
        }
        else if (signatureAlgorithm === "ACS3-RSA-SHA256") {
            if (!secret.startsWith(PEM_BEGIN)) {
                secret = PEM_BEGIN + secret;
            }
            if (!secret.endsWith(PEM_END)) {
                secret = secret + PEM_END;
            }
            var signerObject = crypto_1.default.createSign("RSA-SHA256");
            signerObject.update(source);
            var signature = signerObject.sign({ key: secret, padding: crypto_1.default.constants.RSA_PKCS1_PADDING });
            return signature;
        }
    }
    /**
     * Get the authorization
     * @param request request params
     * @param signatureAlgorithm the autograph method
     * @param payload the hashed request
     * @param acesskey the acesskey string
     * @param accessKeySecret the accessKeySecret string
     * @return authorization string
     */
    static getAuthorization(request, signatureAlgorithm, payload, acesskey, accessKeySecret) {
        const canonicalURI = (request.pathname || "").replace("+", "%20").replace("*", "%2A").replace("%7E", "~");
        const method = request.method;
        const canonicalQueryString = getAuthorizationQueryString(request.query);
        const tuple = getAuthorizationHeaders(request.headers);
        const canonicalheaders = tuple["canonicalheaders"];
        const signedHeaders = tuple["hsKeys"];
        const canonicalRequest = method + "\n" + canonicalURI + "\n" + canonicalQueryString + "\n" + canonicalheaders + "\n" +
            signedHeaders.join(";") + "\n" + payload;
        let raw = Buffer.from(canonicalRequest);
        const stringToSign = signatureAlgorithm + "\n" + Client.hexEncode(Client.hash(raw, signatureAlgorithm));
        const signature = Client.hexEncode(Client.signatureMethod(accessKeySecret, stringToSign, signatureAlgorithm));
        const auth = `${signatureAlgorithm} Credential=${acesskey},SignedHeaders=${signedHeaders.join(';')},Signature=${signature}`;
        return auth;
    }
    static getEncodePath(path) {
        if (typeof path === 'undefined' || path === null) {
            return '';
        }
        let strs = path.split('/');
        for (let i = 0; i < strs.length; i++) {
            strs[i] = encode(strs[i]);
        }
        return strs.join('/');
    }
    static getEncodeParam(param) {
        if (typeof param === 'undefined' || param === null) {
            return '';
        }
        return encode(param);
    }
}
exports["default"] = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 7234:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// This file is auto-generated, don't edit it
/**
 *
 */
const tea_util_1 = __importStar(__nccwpck_require__(1979)), $Util = tea_util_1;
const openapi_client_1 = __importStar(__nccwpck_require__(6642)), $OpenApi = openapi_client_1;
const openapi_util_1 = __importDefault(__nccwpck_require__(8190));
const endpoint_util_1 = __importDefault(__nccwpck_require__(2306));
const $tea = __importStar(__nccwpck_require__(4165));
class AssumeRoleRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            durationSeconds: 'DurationSeconds',
            policy: 'Policy',
            roleArn: 'RoleArn',
            roleSessionName: 'RoleSessionName',
        };
    }
    static types() {
        return {
            durationSeconds: 'number',
            policy: 'string',
            roleArn: 'string',
            roleSessionName: 'string',
        };
    }
}
exports.AssumeRoleRequest = AssumeRoleRequest;
class AssumeRoleResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            assumedRoleUser: 'AssumedRoleUser',
            credentials: 'Credentials',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            assumedRoleUser: AssumeRoleResponseBodyAssumedRoleUser,
            credentials: AssumeRoleResponseBodyCredentials,
            requestId: 'string',
        };
    }
}
exports.AssumeRoleResponseBody = AssumeRoleResponseBody;
class AssumeRoleResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            statusCode: 'statusCode',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            statusCode: 'number',
            body: AssumeRoleResponseBody,
        };
    }
}
exports.AssumeRoleResponse = AssumeRoleResponse;
class AssumeRoleWithOIDCRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            durationSeconds: 'DurationSeconds',
            OIDCProviderArn: 'OIDCProviderArn',
            OIDCToken: 'OIDCToken',
            policy: 'Policy',
            roleArn: 'RoleArn',
            roleSessionName: 'RoleSessionName',
        };
    }
    static types() {
        return {
            durationSeconds: 'number',
            OIDCProviderArn: 'string',
            OIDCToken: 'string',
            policy: 'string',
            roleArn: 'string',
            roleSessionName: 'string',
        };
    }
}
exports.AssumeRoleWithOIDCRequest = AssumeRoleWithOIDCRequest;
class AssumeRoleWithOIDCResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            assumedRoleUser: 'AssumedRoleUser',
            credentials: 'Credentials',
            OIDCTokenInfo: 'OIDCTokenInfo',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            assumedRoleUser: AssumeRoleWithOIDCResponseBodyAssumedRoleUser,
            credentials: AssumeRoleWithOIDCResponseBodyCredentials,
            OIDCTokenInfo: AssumeRoleWithOIDCResponseBodyOIDCTokenInfo,
            requestId: 'string',
        };
    }
}
exports.AssumeRoleWithOIDCResponseBody = AssumeRoleWithOIDCResponseBody;
class AssumeRoleWithOIDCResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            statusCode: 'statusCode',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            statusCode: 'number',
            body: AssumeRoleWithOIDCResponseBody,
        };
    }
}
exports.AssumeRoleWithOIDCResponse = AssumeRoleWithOIDCResponse;
class AssumeRoleWithSAMLRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            durationSeconds: 'DurationSeconds',
            policy: 'Policy',
            roleArn: 'RoleArn',
            SAMLAssertion: 'SAMLAssertion',
            SAMLProviderArn: 'SAMLProviderArn',
        };
    }
    static types() {
        return {
            durationSeconds: 'number',
            policy: 'string',
            roleArn: 'string',
            SAMLAssertion: 'string',
            SAMLProviderArn: 'string',
        };
    }
}
exports.AssumeRoleWithSAMLRequest = AssumeRoleWithSAMLRequest;
class AssumeRoleWithSAMLResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            assumedRoleUser: 'AssumedRoleUser',
            credentials: 'Credentials',
            requestId: 'RequestId',
            SAMLAssertionInfo: 'SAMLAssertionInfo',
        };
    }
    static types() {
        return {
            assumedRoleUser: AssumeRoleWithSAMLResponseBodyAssumedRoleUser,
            credentials: AssumeRoleWithSAMLResponseBodyCredentials,
            requestId: 'string',
            SAMLAssertionInfo: AssumeRoleWithSAMLResponseBodySAMLAssertionInfo,
        };
    }
}
exports.AssumeRoleWithSAMLResponseBody = AssumeRoleWithSAMLResponseBody;
class AssumeRoleWithSAMLResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            statusCode: 'statusCode',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            statusCode: 'number',
            body: AssumeRoleWithSAMLResponseBody,
        };
    }
}
exports.AssumeRoleWithSAMLResponse = AssumeRoleWithSAMLResponse;
class GetCallerIdentityResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accountId: 'AccountId',
            arn: 'Arn',
            identityType: 'IdentityType',
            principalId: 'PrincipalId',
            requestId: 'RequestId',
            roleId: 'RoleId',
            userId: 'UserId',
        };
    }
    static types() {
        return {
            accountId: 'string',
            arn: 'string',
            identityType: 'string',
            principalId: 'string',
            requestId: 'string',
            roleId: 'string',
            userId: 'string',
        };
    }
}
exports.GetCallerIdentityResponseBody = GetCallerIdentityResponseBody;
class GetCallerIdentityResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            statusCode: 'statusCode',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            statusCode: 'number',
            body: GetCallerIdentityResponseBody,
        };
    }
}
exports.GetCallerIdentityResponse = GetCallerIdentityResponse;
class AssumeRoleResponseBodyAssumedRoleUser extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            arn: 'Arn',
            assumedRoleId: 'AssumedRoleId',
        };
    }
    static types() {
        return {
            arn: 'string',
            assumedRoleId: 'string',
        };
    }
}
exports.AssumeRoleResponseBodyAssumedRoleUser = AssumeRoleResponseBodyAssumedRoleUser;
class AssumeRoleResponseBodyCredentials extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accessKeyId: 'AccessKeyId',
            accessKeySecret: 'AccessKeySecret',
            expiration: 'Expiration',
            securityToken: 'SecurityToken',
        };
    }
    static types() {
        return {
            accessKeyId: 'string',
            accessKeySecret: 'string',
            expiration: 'string',
            securityToken: 'string',
        };
    }
}
exports.AssumeRoleResponseBodyCredentials = AssumeRoleResponseBodyCredentials;
class AssumeRoleWithOIDCResponseBodyAssumedRoleUser extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            arn: 'Arn',
            assumedRoleId: 'AssumedRoleId',
        };
    }
    static types() {
        return {
            arn: 'string',
            assumedRoleId: 'string',
        };
    }
}
exports.AssumeRoleWithOIDCResponseBodyAssumedRoleUser = AssumeRoleWithOIDCResponseBodyAssumedRoleUser;
class AssumeRoleWithOIDCResponseBodyCredentials extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accessKeyId: 'AccessKeyId',
            accessKeySecret: 'AccessKeySecret',
            expiration: 'Expiration',
            securityToken: 'SecurityToken',
        };
    }
    static types() {
        return {
            accessKeyId: 'string',
            accessKeySecret: 'string',
            expiration: 'string',
            securityToken: 'string',
        };
    }
}
exports.AssumeRoleWithOIDCResponseBodyCredentials = AssumeRoleWithOIDCResponseBodyCredentials;
class AssumeRoleWithOIDCResponseBodyOIDCTokenInfo extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            clientIds: 'ClientIds',
            issuer: 'Issuer',
            subject: 'Subject',
        };
    }
    static types() {
        return {
            clientIds: 'string',
            issuer: 'string',
            subject: 'string',
        };
    }
}
exports.AssumeRoleWithOIDCResponseBodyOIDCTokenInfo = AssumeRoleWithOIDCResponseBodyOIDCTokenInfo;
class AssumeRoleWithSAMLResponseBodyAssumedRoleUser extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            arn: 'Arn',
            assumedRoleId: 'AssumedRoleId',
        };
    }
    static types() {
        return {
            arn: 'string',
            assumedRoleId: 'string',
        };
    }
}
exports.AssumeRoleWithSAMLResponseBodyAssumedRoleUser = AssumeRoleWithSAMLResponseBodyAssumedRoleUser;
class AssumeRoleWithSAMLResponseBodyCredentials extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accessKeyId: 'AccessKeyId',
            accessKeySecret: 'AccessKeySecret',
            expiration: 'Expiration',
            securityToken: 'SecurityToken',
        };
    }
    static types() {
        return {
            accessKeyId: 'string',
            accessKeySecret: 'string',
            expiration: 'string',
            securityToken: 'string',
        };
    }
}
exports.AssumeRoleWithSAMLResponseBodyCredentials = AssumeRoleWithSAMLResponseBodyCredentials;
class AssumeRoleWithSAMLResponseBodySAMLAssertionInfo extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            issuer: 'Issuer',
            recipient: 'Recipient',
            subject: 'Subject',
            subjectType: 'SubjectType',
        };
    }
    static types() {
        return {
            issuer: 'string',
            recipient: 'string',
            subject: 'string',
            subjectType: 'string',
        };
    }
}
exports.AssumeRoleWithSAMLResponseBodySAMLAssertionInfo = AssumeRoleWithSAMLResponseBodySAMLAssertionInfo;
class Client extends openapi_client_1.default {
    constructor(config) {
        super(config);
        this._signatureAlgorithm = "v2";
        this._endpointRule = "regional";
        this._endpointMap = {
            'ap-northeast-2-pop': "sts.aliyuncs.com",
            'cn-beijing-finance-1': "sts.aliyuncs.com",
            'cn-beijing-finance-pop': "sts.aliyuncs.com",
            'cn-beijing-gov-1': "sts.aliyuncs.com",
            'cn-beijing-nu16-b01': "sts.aliyuncs.com",
            'cn-edge-1': "sts.aliyuncs.com",
            'cn-fujian': "sts.aliyuncs.com",
            'cn-haidian-cm12-c01': "sts.aliyuncs.com",
            'cn-hangzhou-bj-b01': "sts.aliyuncs.com",
            'cn-hangzhou-finance': "sts.aliyuncs.com",
            'cn-hangzhou-internal-prod-1': "sts.aliyuncs.com",
            'cn-hangzhou-internal-test-1': "sts.aliyuncs.com",
            'cn-hangzhou-internal-test-2': "sts.aliyuncs.com",
            'cn-hangzhou-internal-test-3': "sts.aliyuncs.com",
            'cn-hangzhou-test-306': "sts.aliyuncs.com",
            'cn-hongkong-finance-pop': "sts.aliyuncs.com",
            'cn-huhehaote-nebula-1': "sts.aliyuncs.com",
            'cn-north-2-gov-1': "sts-vpc.cn-north-2-gov-1.aliyuncs.com",
            'cn-qingdao-nebula': "sts.aliyuncs.com",
            'cn-shanghai-et15-b01': "sts.aliyuncs.com",
            'cn-shanghai-et2-b01': "sts.aliyuncs.com",
            'cn-shanghai-inner': "sts.aliyuncs.com",
            'cn-shanghai-internal-test-1': "sts.aliyuncs.com",
            'cn-shenzhen-finance-1': "sts-vpc.cn-shenzhen-finance-1.aliyuncs.com",
            'cn-shenzhen-inner': "sts.aliyuncs.com",
            'cn-shenzhen-st4-d01': "sts.aliyuncs.com",
            'cn-shenzhen-su18-b01': "sts.aliyuncs.com",
            'cn-wuhan': "sts.aliyuncs.com",
            'cn-yushanfang': "sts.aliyuncs.com",
            'cn-zhangbei': "sts.aliyuncs.com",
            'cn-zhangbei-na61-b01': "sts.aliyuncs.com",
            'cn-zhangjiakou-na62-a01': "sts.aliyuncs.com",
            'cn-zhengzhou-nebula-1': "sts.aliyuncs.com",
            'eu-west-1-oxs': "sts.aliyuncs.com",
            'rus-west-1-pop': "sts.aliyuncs.com",
        };
        this.checkConfig(config);
        this._endpoint = this.getEndpoint("sts", this._regionId, this._endpointRule, this._network, this._suffix, this._endpointMap, this._endpoint);
    }
    getEndpoint(productId, regionId, endpointRule, network, suffix, endpointMap, endpoint) {
        if (!tea_util_1.default.empty(endpoint)) {
            return endpoint;
        }
        if (!tea_util_1.default.isUnset(endpointMap) && !tea_util_1.default.empty(endpointMap[regionId])) {
            return endpointMap[regionId];
        }
        return endpoint_util_1.default.getEndpointRules(productId, regionId, endpointRule, network, suffix);
    }
    async assumeRoleWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = {};
        if (!tea_util_1.default.isUnset(request.durationSeconds)) {
            query["DurationSeconds"] = request.durationSeconds;
        }
        if (!tea_util_1.default.isUnset(request.policy)) {
            query["Policy"] = request.policy;
        }
        if (!tea_util_1.default.isUnset(request.roleArn)) {
            query["RoleArn"] = request.roleArn;
        }
        if (!tea_util_1.default.isUnset(request.roleSessionName)) {
            query["RoleSessionName"] = request.roleSessionName;
        }
        let req = new $OpenApi.OpenApiRequest({
            query: openapi_util_1.default.query(query),
        });
        let params = new $OpenApi.Params({
            action: "AssumeRole",
            version: "2015-04-01",
            protocol: "HTTPS",
            pathname: "/",
            method: "POST",
            authType: "AK",
            style: "RPC",
            reqBodyType: "formData",
            bodyType: "json",
        });
        return $tea.cast(await this.callApi(params, req, runtime), new AssumeRoleResponse({}));
    }
    async assumeRole(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.assumeRoleWithOptions(request, runtime);
    }
    async assumeRoleWithOIDCWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = {};
        if (!tea_util_1.default.isUnset(request.durationSeconds)) {
            query["DurationSeconds"] = request.durationSeconds;
        }
        if (!tea_util_1.default.isUnset(request.OIDCProviderArn)) {
            query["OIDCProviderArn"] = request.OIDCProviderArn;
        }
        if (!tea_util_1.default.isUnset(request.OIDCToken)) {
            query["OIDCToken"] = request.OIDCToken;
        }
        if (!tea_util_1.default.isUnset(request.policy)) {
            query["Policy"] = request.policy;
        }
        if (!tea_util_1.default.isUnset(request.roleArn)) {
            query["RoleArn"] = request.roleArn;
        }
        if (!tea_util_1.default.isUnset(request.roleSessionName)) {
            query["RoleSessionName"] = request.roleSessionName;
        }
        let req = new $OpenApi.OpenApiRequest({
            query: openapi_util_1.default.query(query),
        });
        let params = new $OpenApi.Params({
            action: "AssumeRoleWithOIDC",
            version: "2015-04-01",
            protocol: "HTTPS",
            pathname: "/",
            method: "POST",
            authType: "Anonymous",
            style: "RPC",
            reqBodyType: "formData",
            bodyType: "json",
        });
        return $tea.cast(await this.callApi(params, req, runtime), new AssumeRoleWithOIDCResponse({}));
    }
    async assumeRoleWithOIDC(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.assumeRoleWithOIDCWithOptions(request, runtime);
    }
    async assumeRoleWithSAMLWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = {};
        if (!tea_util_1.default.isUnset(request.durationSeconds)) {
            query["DurationSeconds"] = request.durationSeconds;
        }
        if (!tea_util_1.default.isUnset(request.policy)) {
            query["Policy"] = request.policy;
        }
        if (!tea_util_1.default.isUnset(request.roleArn)) {
            query["RoleArn"] = request.roleArn;
        }
        if (!tea_util_1.default.isUnset(request.SAMLAssertion)) {
            query["SAMLAssertion"] = request.SAMLAssertion;
        }
        if (!tea_util_1.default.isUnset(request.SAMLProviderArn)) {
            query["SAMLProviderArn"] = request.SAMLProviderArn;
        }
        let req = new $OpenApi.OpenApiRequest({
            query: openapi_util_1.default.query(query),
        });
        let params = new $OpenApi.Params({
            action: "AssumeRoleWithSAML",
            version: "2015-04-01",
            protocol: "HTTPS",
            pathname: "/",
            method: "POST",
            authType: "Anonymous",
            style: "RPC",
            reqBodyType: "formData",
            bodyType: "json",
        });
        return $tea.cast(await this.callApi(params, req, runtime), new AssumeRoleWithSAMLResponse({}));
    }
    async assumeRoleWithSAML(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.assumeRoleWithSAMLWithOptions(request, runtime);
    }
    async getCallerIdentityWithOptions(runtime) {
        let req = new $OpenApi.OpenApiRequest({});
        let params = new $OpenApi.Params({
            action: "GetCallerIdentity",
            version: "2015-04-01",
            protocol: "HTTPS",
            pathname: "/",
            method: "POST",
            authType: "AK",
            style: "RPC",
            reqBodyType: "formData",
            bodyType: "json",
        });
        return $tea.cast(await this.callApi(params, req, runtime), new GetCallerIdentityResponse({}));
    }
    async getCallerIdentity() {
        let runtime = new $Util.RuntimeOptions({});
        return await this.getCallerIdentityWithOptions(runtime);
    }
}
exports["default"] = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 4165:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isRetryable = exports.retryError = exports.newUnretryableError = exports.getBackoffTime = exports.allowRetry = exports.sleep = exports.cast = exports.Model = exports.toMap = exports.newError = exports.doAction = exports.Response = exports.Request = exports.BytesReadable = void 0;
var querystring = __importStar(__nccwpck_require__(3477));
var http_1 = __nccwpck_require__(3685);
var https_1 = __nccwpck_require__(5687);
var stream_1 = __nccwpck_require__(2781);
var httpx = __importStar(__nccwpck_require__(9074));
var url_1 = __nccwpck_require__(7310);
var BytesReadable = /** @class */ (function (_super) {
    __extends(BytesReadable, _super);
    function BytesReadable(value) {
        var _this = _super.call(this) || this;
        if (typeof value === 'string') {
            _this.value = Buffer.from(value);
        }
        else if (Buffer.isBuffer(value)) {
            _this.value = value;
        }
        return _this;
    }
    BytesReadable.prototype._read = function () {
        this.push(this.value);
        this.push(null);
    };
    return BytesReadable;
}(stream_1.Readable));
exports.BytesReadable = BytesReadable;
var Request = /** @class */ (function () {
    function Request() {
        this.headers = {};
        this.query = {};
    }
    return Request;
}());
exports.Request = Request;
var Response = /** @class */ (function () {
    function Response(httpResponse) {
        this.statusCode = httpResponse.statusCode;
        this.statusMessage = httpResponse.statusMessage;
        this.headers = this.convertHeaders(httpResponse.headers);
        this.body = httpResponse;
    }
    Response.prototype.convertHeaders = function (headers) {
        var results = {};
        var keys = Object.keys(headers);
        for (var index = 0; index < keys.length; index++) {
            var key = keys[index];
            results[key] = headers[key];
        }
        return results;
    };
    Response.prototype.readBytes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, httpx.read(this.body, '')];
                    case 1:
                        buff = _a.sent();
                        return [2 /*return*/, buff];
                }
            });
        });
    };
    return Response;
}());
exports.Response = Response;
function buildURL(request) {
    var url = request.protocol + "://" + request.headers['host'];
    if (request.port) {
        url += ":" + request.port;
    }
    url += "" + request.pathname;
    var urlInfo = url_1.parse(url);
    if (request.query && Object.keys(request.query).length > 0) {
        if (urlInfo.query) {
            url += "&" + querystring.stringify(request.query);
        }
        else {
            url += "?" + querystring.stringify(request.query);
        }
    }
    return url;
}
function isModelClass(t) {
    if (!t) {
        return false;
    }
    return typeof t.types === 'function' && typeof t.names === 'function';
}
function doAction(request, runtime) {
    if (runtime === void 0) { runtime = null; }
    return __awaiter(this, void 0, void 0, function () {
        var url, method, options, agentOptions, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = buildURL(request);
                    method = (request.method || 'GET').toUpperCase();
                    options = {
                        method: method,
                        headers: request.headers
                    };
                    if (method !== 'GET' && method !== 'HEAD') {
                        options.data = request.body;
                    }
                    if (runtime) {
                        if (typeof runtime.timeout !== 'undefined') {
                            options.timeout = Number(runtime.timeout);
                        }
                        if (typeof runtime.readTimeout !== 'undefined') {
                            options.readTimeout = Number(runtime.readTimeout);
                        }
                        if (typeof runtime.connectTimeout !== 'undefined') {
                            options.connectTimeout = Number(runtime.connectTimeout);
                        }
                        if (typeof runtime.ignoreSSL !== 'undefined') {
                            options.rejectUnauthorized = !runtime.ignoreSSL;
                        }
                        if (typeof runtime.key !== 'undefined') {
                            options.key = String(runtime.key);
                        }
                        if (typeof runtime.cert !== 'undefined') {
                            options.cert = String(runtime.cert);
                        }
                        if (typeof runtime.ca !== 'undefined') {
                            options.ca = String(runtime.ca);
                        }
                        agentOptions = {
                            keepAlive: true,
                        };
                        if (typeof runtime.keepAlive !== 'undefined') {
                            agentOptions.keepAlive = runtime.keepAlive;
                            if (request.protocol && request.protocol.toLowerCase() === 'https') {
                                options.agent = new https_1.Agent(agentOptions);
                            }
                            else {
                                options.agent = new http_1.Agent(agentOptions);
                            }
                        }
                    }
                    return [4 /*yield*/, httpx.request(url, options)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, new Response(response)];
            }
        });
    });
}
exports.doAction = doAction;
var ResponseError = /** @class */ (function (_super) {
    __extends(ResponseError, _super);
    function ResponseError(map) {
        var _this = _super.call(this, map.code + ": " + map.message) || this;
        _this.code = map.code;
        _this.data = map.data;
        _this.description = map.description;
        _this.accessDeniedDetail = map.accessDeniedDetail;
        if (_this.data && _this.data.statusCode) {
            _this.statusCode = Number(_this.data.statusCode);
        }
        return _this;
    }
    return ResponseError;
}(Error));
function newError(data) {
    return new ResponseError(data);
}
exports.newError = newError;
function getValue(type, value) {
    if (typeof type === 'string') {
        // basic type
        return value;
    }
    if (type.type === 'array') {
        if (!Array.isArray(value)) {
            throw new Error("expect: array, actual: " + typeof value);
        }
        return value.map(function (item) {
            return getValue(type.itemType, item);
        });
    }
    if (typeof type === 'function') {
        if (isModelClass(type)) {
            return new type(value);
        }
        return value;
    }
    return value;
}
function toMap(value) {
    if (value === void 0) { value = undefined; }
    if (typeof value === 'undefined' || value == null) {
        return null;
    }
    if (value instanceof Model) {
        return value.toMap();
    }
    // 如果是另一个版本的 tea-typescript 创建的 model，instanceof 会判断不通过
    // 这里做一下处理
    if (typeof value.toMap === 'function') {
        return value.toMap();
    }
    if (Array.isArray(value)) {
        return value.map(function (item) {
            return toMap(item);
        });
    }
    return value;
}
exports.toMap = toMap;
var Model = /** @class */ (function () {
    function Model(map) {
        var _this = this;
        if (map == null) {
            return;
        }
        var clz = this.constructor;
        var names = clz.names();
        var types = clz.types();
        Object.keys(names).forEach((function (name) {
            var value = map[name];
            if (value === undefined || value === null) {
                return;
            }
            var type = types[name];
            _this[name] = getValue(type, value);
        }));
    }
    Model.prototype.toMap = function () {
        var _this = this;
        var map = {};
        var clz = this.constructor;
        var names = clz.names();
        Object.keys(names).forEach((function (name) {
            var originName = names[name];
            var value = _this[name];
            if (typeof value === 'undefined' || value == null) {
                return;
            }
            map[originName] = toMap(value);
        }));
        return map;
    };
    return Model;
}());
exports.Model = Model;
function cast(obj, t) {
    if (!obj) {
        throw new Error('can not cast to Map');
    }
    if (typeof obj !== 'object') {
        throw new Error('can not cast to Map');
    }
    var map = obj;
    var clz = t.constructor;
    var names = clz.names();
    var types = clz.types();
    Object.keys(names).forEach(function (key) {
        var originName = names[key];
        var value = map[originName];
        var type = types[key];
        if (typeof value === 'undefined' || value == null) {
            return;
        }
        if (typeof type === 'string') {
            if (type === 'Readable' ||
                type === 'map' ||
                type === 'Buffer' ||
                type === 'any' ||
                typeof value === type) {
                t[key] = value;
                return;
            }
            if (type === 'string' &&
                (typeof value === 'number' ||
                    typeof value === 'boolean')) {
                t[key] = value.toString();
                return;
            }
            if (type === 'boolean') {
                if (value === 1 || value === 0) {
                    t[key] = !!value;
                    return;
                }
                if (value === 'true' || value === 'false') {
                    t[key] = value === 'true';
                    return;
                }
            }
            if (type === 'number' && typeof value === 'string') {
                if (value.match(/^\d*$/)) {
                    t[key] = parseInt(value);
                    return;
                }
                if (value.match(/^[\.\d]*$/)) {
                    t[key] = parseFloat(value);
                    return;
                }
            }
            throw new Error("type of " + key + " is mismatch, expect " + type + ", but " + typeof value);
        }
        else if (type.type === 'map') {
            if (!(value instanceof Object)) {
                throw new Error("type of " + key + " is mismatch, expect object, but " + typeof value);
            }
            t[key] = value;
        }
        else if (type.type === 'array') {
            if (!Array.isArray(value)) {
                throw new Error("type of " + key + " is mismatch, expect array, but " + typeof value);
            }
            if (typeof type.itemType === 'function') {
                t[key] = value.map(function (d) {
                    if (isModelClass(type.itemType)) {
                        return cast(d, new type.itemType({}));
                    }
                    return d;
                });
            }
            else {
                t[key] = value;
            }
        }
        else if (typeof type === 'function') {
            if (!(value instanceof Object)) {
                throw new Error("type of " + key + " is mismatch, expect object, but " + typeof value);
            }
            if (isModelClass(type)) {
                t[key] = cast(value, new type({}));
                return;
            }
            t[key] = value;
        }
        else {
        }
    });
    return t;
}
exports.cast = cast;
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function allowRetry(retry, retryTimes, startTime) {
    // 还未重试
    if (retryTimes === 0) {
        return true;
    }
    if (retry.retryable !== true) {
        return false;
    }
    if (retry.policy === 'never') {
        return false;
    }
    if (retry.policy === 'always') {
        return true;
    }
    if (retry.policy === 'simple') {
        return (retryTimes < retry['maxAttempts']);
    }
    if (retry.policy === 'timeout') {
        return Date.now() - startTime < retry.timeout;
    }
    if (retry.maxAttempts && typeof retry.maxAttempts === 'number') {
        return retry.maxAttempts >= retryTimes;
    }
    // 默认不重试
    return false;
}
exports.allowRetry = allowRetry;
function getBackoffTime(backoff, retryTimes) {
    if (retryTimes === 0) {
        // 首次调用，不使用退避策略
        return 0;
    }
    if (backoff.policy === 'no') {
        // 不退避
        return 0;
    }
    if (backoff.policy === 'fixed') {
        // 固定退避
        return backoff.period;
    }
    if (backoff.policy === 'random') {
        // 随机退避
        var min = backoff['minPeriod'];
        var max = backoff['maxPeriod'];
        return min + (max - min) * Math.random();
    }
    if (backoff.policy === 'exponential') {
        // 指数退避
        var init = backoff.initial;
        var multiplier = backoff.multiplier;
        var time = init * Math.pow(1 + multiplier, retryTimes - 1);
        var max = backoff.max;
        return Math.min(time, max);
    }
    if (backoff.policy === 'exponential_random') {
        // 指数随机退避
        var init = backoff.initial;
        var multiplier = backoff.multiplier;
        var time = init * Math.pow(1 + multiplier, retryTimes - 1);
        var max = backoff.max;
        return Math.min(time * (0.5 + Math.random()), max);
    }
    return 0;
}
exports.getBackoffTime = getBackoffTime;
var UnretryableError = /** @class */ (function (_super) {
    __extends(UnretryableError, _super);
    function UnretryableError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'UnretryableError';
        return _this;
    }
    return UnretryableError;
}(Error));
function newUnretryableError(request) {
    var e = new UnretryableError('');
    e.data = {
        lastRequest: request
    };
    return e;
}
exports.newUnretryableError = newUnretryableError;
var RetryError = /** @class */ (function (_super) {
    __extends(RetryError, _super);
    function RetryError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'RetryError';
        return _this;
    }
    return RetryError;
}(Error));
function retryError(request, response) {
    var e = new RetryError('');
    e.data = {
        request: request,
        response: response
    };
    return e;
}
exports.retryError = retryError;
function isRetryable(err) {
    if (typeof err === 'undefined' || err === null) {
        return false;
    }
    return err.name === 'RetryError';
}
exports.isRetryable = isRetryable;
//# sourceMappingURL=tea.js.map

/***/ }),

/***/ 1979:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeOptions = void 0;
const $tea = __importStar(__nccwpck_require__(4165));
const kitx = __importStar(__nccwpck_require__(8683));
const querystring_1 = __importDefault(__nccwpck_require__(3477));
const os_1 = __nccwpck_require__(2037);
const DEFAULT_USER_AGENT = `AlibabaCloud (${os_1.platform()}; ${os_1.arch()}) Node.js/${process.version} Core/1.0.1 TeaDSL/1`;
class RuntimeOptions extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            autoretry: 'autoretry',
            ignoreSSL: 'ignoreSSL',
            maxAttempts: 'max_attempts',
            backoffPolicy: 'backoff_policy',
            backoffPeriod: 'backoff_period',
            readTimeout: 'readTimeout',
            connectTimeout: 'connectTimeout',
            httpProxy: 'httpProxy',
            httpsProxy: 'httpsProxy',
            noProxy: 'noProxy',
            maxIdleConns: 'maxIdleConns',
            keepAlive: 'keepAlive',
        };
    }
    static types() {
        return {
            autoretry: 'boolean',
            ignoreSSL: 'boolean',
            maxAttempts: 'number',
            backoffPolicy: 'string',
            backoffPeriod: 'number',
            readTimeout: 'number',
            connectTimeout: 'number',
            httpProxy: 'string',
            httpsProxy: 'string',
            noProxy: 'string',
            maxIdleConns: 'number',
            keepAlive: 'boolean',
        };
    }
}
exports.RuntimeOptions = RuntimeOptions;
function read(readable) {
    return new Promise((resolve, reject) => {
        let onData, onError, onEnd;
        var cleanup = function () {
            // cleanup
            readable.removeListener('error', onError);
            readable.removeListener('data', onData);
            readable.removeListener('end', onEnd);
        };
        var bufs = [];
        var size = 0;
        onData = function (buf) {
            bufs.push(buf);
            size += buf.length;
        };
        onError = function (err) {
            cleanup();
            reject(err);
        };
        onEnd = function () {
            cleanup();
            resolve(Buffer.concat(bufs, size));
        };
        readable.on('error', onError);
        readable.on('data', onData);
        readable.on('end', onEnd);
    });
}
class Client {
    static toString(buff) {
        return buff.toString();
    }
    static parseJSON(text) {
        return JSON.parse(text);
    }
    static async readAsBytes(stream) {
        return await read(stream);
    }
    static async readAsString(stream) {
        let buff = await Client.readAsBytes(stream);
        return Client.toString(buff);
    }
    static async readAsJSON(stream) {
        return Client.parseJSON(await Client.readAsString(stream));
    }
    static getNonce() {
        return kitx.makeNonce();
    }
    static getDateUTCString() {
        const now = new Date();
        return now.toUTCString();
    }
    static defaultString(real, defaultValue) {
        return real || defaultValue;
    }
    static defaultNumber(real, defaultValue) {
        return real || defaultValue;
    }
    static toFormString(val) {
        return querystring_1.default.stringify(val);
    }
    static toJSONString(val) {
        if (typeof val === 'string') {
            return val;
        }
        return JSON.stringify(val);
    }
    static toBytes(val) {
        return Buffer.from(val);
    }
    static empty(val) {
        return !val;
    }
    static equalString(val1, val2) {
        return val1 === val2;
    }
    static equalNumber(val1, val2) {
        return val1 === val2;
    }
    static isUnset(value) {
        if (typeof value === 'undefined') {
            return true;
        }
        if (value === null) {
            return true;
        }
        return false;
    }
    static stringifyMapValue(m) {
        if (!m) {
            return m;
        }
        const result = {};
        for (const [key, value] of Object.entries(m)) {
            if (typeof value === 'undefined' || value === null) {
                continue;
            }
            result[key] = String(value);
        }
        return result;
    }
    static anyifyMapValue(m) {
        return m;
    }
    static assertAsBoolean(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        throw new Error(`The value is not a boolean`);
    }
    static assertAsString(value) {
        if (typeof value === 'string') {
            return value;
        }
        throw new Error(`The value is not a string`);
    }
    static assertAsNumber(value) {
        if (typeof value === 'number') {
            return value;
        }
        throw new Error(`The value is not a number`);
    }
    static assertAsMap(value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return value;
        }
        throw new Error(`The value is not a object`);
    }
    static assertAsArray(value) {
        if (Array.isArray(value)) {
            return value;
        }
        throw new Error(`The value is not array`);
    }
    static assertAsBytes(value) {
        if (Buffer.isBuffer(value)) {
            return value;
        }
        throw new Error(`The value is not bytes`);
    }
    static getUserAgent(userAgent) {
        if (!userAgent || !userAgent.length) {
            return DEFAULT_USER_AGENT;
        }
        return DEFAULT_USER_AGENT + " " + userAgent;
    }
    static is2xx(code) {
        return code >= 200 && code < 300;
    }
    static is3xx(code) {
        return code >= 300 && code < 400;
    }
    static is4xx(code) {
        return code >= 400 && code < 500;
    }
    static is5xx(code) {
        return code >= 500 && code < 600;
    }
    static validateModel(m) {
    }
    static toMap(inputModel) {
        return $tea.toMap(inputModel);
    }
    static async sleep(millisecond) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, millisecond);
        });
    }
    static toArray(input) {
        if (!(input instanceof Array)) {
            return null;
        }
        let ret = [];
        input.forEach((model) => {
            if (!model) {
                return;
            }
            ret.push($tea.toMap(model));
        });
        return ret;
    }
}
exports["default"] = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 5757:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const xml2js_1 = __nccwpck_require__(6189);
class Client {
    static parseXml(body, response) {
        let ret = this._parseXML(body);
        if (response !== null && typeof response !== 'undefined') {
            ret = this._xmlCast(ret, response);
        }
        return ret;
    }
    static toXML(body) {
        const builder = new xml2js_1.Builder();
        return builder.buildObject(body);
    }
    static _parseXML(body) {
        let parser = new xml2js_1.Parser({ explicitArray: false });
        let result = {};
        parser.parseString(body, function (err, output) {
            result.err = err;
            result.output = output;
        });
        if (result.err) {
            throw result.err;
        }
        return result.output;
    }
    static _xmlCast(obj, clazz) {
        obj = obj || {};
        let ret = {};
        let clz = clazz;
        let names = clz.names();
        let types = clz.types();
        Object.keys(names).forEach((key) => {
            let originName = names[key];
            let value = obj[originName];
            let type = types[key];
            switch (type) {
                case 'boolean':
                    if (!value) {
                        ret[originName] = false;
                        return;
                    }
                    ret[originName] = value === 'false' ? false : true;
                    return;
                case 'number':
                    if (value != 0 && !value) {
                        ret[originName] = NaN;
                        return;
                    }
                    ret[originName] = +value;
                    return;
                case 'string':
                    if (!value) {
                        ret[originName] = '';
                        return;
                    }
                    ret[originName] = value.toString();
                    return;
                default:
                    if (type.type === 'array') {
                        if (!value) {
                            ret[originName] = [];
                            return;
                        }
                        if (!Array.isArray(value)) {
                            value = [value];
                        }
                        if (typeof type.itemType === 'function') {
                            ret[originName] = value.map((d) => {
                                return this._xmlCast(d, type.itemType);
                            });
                        }
                        else {
                            ret[originName] = value;
                        }
                    }
                    else if (typeof type === 'function') {
                        if (!value) {
                            value = {};
                        }
                        ret[originName] = this._xmlCast(value, type);
                    }
                    else {
                        ret[originName] = value;
                    }
            }
        });
        return ret;
    }
}
exports["default"] = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 308:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

(()=>{"use strict";var e={3497:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});t.isExternalAccount=t.isServiceAccountKey=t.parseCredential=void 0;const s=n(6976);const i=n(3102);function parseCredential(e){e=(e||"").trim();if(!e){throw new Error(`Missing service account key JSON (got empty value)`)}if(!e.startsWith("{")){e=(0,i.fromBase64)(e)}try{const t=JSON.parse(e);return t}catch(e){const t=(0,s.errorMessage)(e);throw new SyntaxError(`Failed to parse service account key JSON credentials: ${t}`)}}t.parseCredential=parseCredential;function isServiceAccountKey(e){return e.type==="service_account"}t.isServiceAccountKey=isServiceAccountKey;function isExternalAccount(e){return e.type!=="external_account"}t.isExternalAccount=isExternalAccount;t["default"]={parseCredential:parseCredential,isServiceAccountKey:isServiceAccountKey,isExternalAccount:isExternalAccount}},1848:function(e,t,n){var s=this&&this.__createBinding||(Object.create?function(e,t,n,s){if(s===undefined)s=n;var i=Object.getOwnPropertyDescriptor(t,n);if(!i||("get"in i?!t.__esModule:i.writable||i.configurable)){i={enumerable:true,get:function(){return t[n]}}}Object.defineProperty(e,s,i)}:function(e,t,n,s){if(s===undefined)s=n;e[s]=t[n]});var i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t});var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(n!=="default"&&Object.prototype.hasOwnProperty.call(e,n))s(t,e,n);i(t,e);return t};Object.defineProperty(t,"__esModule",{value:true});t.deepClone=void 0;const o=r(n(4655));function deepClone(e,t=true){if(t&&typeof structuredClone==="function"){return structuredClone(e)}return o.deserialize(o.serialize(e))}t.deepClone=deepClone},7962:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.parseCSV=void 0;function parseCSV(e){e=(e||"").trim();if(!e){return[]}const t=e.split(/(?<!\\),/gi);for(let e=0;e<t.length;e++){t[e]=t[e].trim().replace(/\\,/gi,",")}return t}t.parseCSV=parseCSV},3102:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.fromBase64=t.toBase64=void 0;function toBase64(e){return Buffer.from(e).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}t.toBase64=toBase64;function fromBase64(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");while(t.length%4)t+="=";return Buffer.from(t,"base64").toString("utf8")}t.fromBase64=fromBase64},6976:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.isNotFoundError=t.errorMessage=void 0;function errorMessage(e){let t;if(e===null){t="null"}else if(e===undefined||typeof e==="undefined"){t="undefined"}else if(typeof e==="bigint"||e instanceof BigInt){t=e.toString()}else if(typeof e==="boolean"||e instanceof Boolean){t=e.toString()}else if(e instanceof Error){t=e.message}else if(typeof e==="function"||e instanceof Function){t=errorMessage(e())}else if(typeof e==="number"||e instanceof Number){t=e.toString()}else if(typeof e==="string"||e instanceof String){t=e.toString()}else if(typeof e==="symbol"||e instanceof Symbol){t=e.toString()}else if(typeof e==="object"||e instanceof Object){t=JSON.stringify(e)}else{t=String(`[${typeof e}] ${e}`)}const n=t.trim().replace("Error: ","").trim();if(!n)return"";if(n.length>1&&isUpper(n[0])&&!isUpper(n[1])){return n[0].toLowerCase()+n.slice(1)}return n}t.errorMessage=errorMessage;function isNotFoundError(e){const t=errorMessage(e);return t.toUpperCase().includes("ENOENT")}t.isNotFoundError=isNotFoundError;function isUpper(e){return e===e.toUpperCase()}},3252:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.readUntil=t.parseFlags=void 0;function parseFlags(e){const t=[];let n="";let s=false;for(let i=0;i<e.length;i++){const r=e[i];if(r===`'`){const t=readUntil(e.slice(i+1),`'`);if(t===null){throw new Error(`Unterminated single quote in ${e} at position ${i}`)}n+=r+t;i+=t.length;continue}if(r===`"`){const t=readUntil(e.slice(i+1),`"`);if(t===null){throw new Error(`Unterminated double quote in ${e} at position ${i}`)}n+=r+t;i+=t.length;continue}if(r==="\r"||r===`\n`||r===` `){s=false;if(n!==``){t.push(n);n=``}continue}if(r===`=`){if(!s&&n[0]===`-`){t.push(n);n=``;s=true;continue}}n+=r}if(n!==""){t.push(n)}return t}t.parseFlags=parseFlags;function readUntil(e,t){let n=false;let s="";for(let i=0;i<e.length;i++){const r=e[i];s+=r;if(r===`\\`){n=true;continue}if(r===t&&!n){return s}n=false}return null}t.readUntil=readUntil},9219:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.removeFile=t.writeSecureFile=t.isEmptyDir=t.forceRemove=void 0;const i=n(7147);const r=n(6976);function forceRemove(e){return s(this,void 0,void 0,(function*(){try{yield i.promises.rm(e,{force:true,recursive:true})}catch(t){if(!(0,r.isNotFoundError)(t)){const n=(0,r.errorMessage)(t);throw new Error(`Failed to remove "${e}": ${n}`)}}}))}t.forceRemove=forceRemove;function isEmptyDir(e){return s(this,void 0,void 0,(function*(){try{const t=yield i.promises.readdir(e);return t.length<=0}catch(e){return true}}))}t.isEmptyDir=isEmptyDir;function writeSecureFile(e,t){return s(this,void 0,void 0,(function*(){yield i.promises.writeFile(e,t,{mode:416,flag:"wx"});return e}))}t.writeSecureFile=writeSecureFile;function removeFile(e){return s(this,void 0,void 0,(function*(){try{yield i.promises.unlink(e);return true}catch(t){if((0,r.isNotFoundError)(t)){return false}const n=(0,r.errorMessage)(t);throw new Error(`Failed to remove "${e}": ${n}`)}}))}t.removeFile=removeFile},546:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.parseGcloudIgnore=void 0;const i=n(7147);const r=n(1017);const o=n(6976);function parseGcloudIgnore(e){return s(this,void 0,void 0,(function*(){const t=(0,r.dirname)(e);let n=[];try{n=(yield i.promises.readFile(e,{encoding:"utf-8"})).toString().split(/\r?\n/).filter(shouldKeepIgnoreLine).map((e=>e.trim()))}catch(e){if(!(0,o.isNotFoundError)(e)){throw e}}for(let e=0;e<n.length;e++){const s=n[e];if(s.startsWith("#!include:")){const o=s.substring(10).trim();const a=(0,r.join)(t,o);const c=(yield i.promises.readFile(a,{encoding:"utf-8"})).toString().split(/\r?\n/).filter(shouldKeepIgnoreLine).map((e=>e.trim()));n.splice(e,1,...c);e+=c.length}}return n}))}t.parseGcloudIgnore=parseGcloudIgnore;function shouldKeepIgnoreLine(e){const t=(e||"").trim();if(t===""){return false}if(t.startsWith("#")&&!t.startsWith("#!")){return false}return true}},6144:function(e,t,n){var s=this&&this.__createBinding||(Object.create?function(e,t,n,s){if(s===undefined)s=n;var i=Object.getOwnPropertyDescriptor(t,n);if(!i||("get"in i?!t.__esModule:i.writable||i.configurable)){i={enumerable:true,get:function(){return t[n]}}}Object.defineProperty(e,s,i)}:function(e,t,n,s){if(s===undefined)s=n;e[s]=t[n]});var i=this&&this.__exportStar||function(e,t){for(var n in e)if(n!=="default"&&!Object.prototype.hasOwnProperty.call(t,n))s(t,e,n)};Object.defineProperty(t,"__esModule",{value:true});i(n(3497),t);i(n(1848),t);i(n(7962),t);i(n(3102),t);i(n(6976),t);i(n(3252),t);i(n(9219),t);i(n(546),t);i(n(575),t);i(n(9497),t);i(n(5737),t);i(n(570),t);i(n(1043),t);i(n(9017),t);i(n(7575),t);i(n(596),t);i(n(9324),t)},575:function(e,t,n){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:true});t.parseKVStringAndFile=t.parseKVYAML=t.parseKVJSON=t.parseKVFile=t.parseKVString=void 0;const i=s(n(4083));const r=n(7147);const o=n(6976);function parseKVString(e){e=(e||"").trim();if(!e){return{}}const t={};const n=e.split(/(?<!\\)[,\n]/gi);for(let e=0;e<n.length;e++){const s=(n[e]||"").trim();if(!s){continue}const i=s.indexOf("=");if(!i||i===-1){throw new SyntaxError(`Failed to parse KEY=VALUE pair "${s}": missing "="`)}const r=s.slice(0,i).trim().replace(/\\([,\n])/gi,"$1");const o=s.slice(i+1).trim().replace(/\\([,\n])/gi,"$1");if(!r||!o){throw new SyntaxError(`Failed to parse KEY=VALUE pair "${s}": no value`)}t[r]=o}return t}t.parseKVString=parseKVString;function parseKVFile(e){try{const t=(0,r.readFileSync)(e,"utf-8");if(t&&t.trim()&&t.trim()[0]==="{"){return parseKVJSON(t)}return parseKVYAML(t)}catch(t){const n=(0,o.errorMessage)(t);throw new Error(`Failed to read file '${e}': ${n}`)}}t.parseKVFile=parseKVFile;function parseKVJSON(e){e=(e||"").trim();if(!e){return{}}try{const t=JSON.parse(e);const n={};for(const[e,s]of Object.entries(t)){if(typeof e!=="string"){throw new SyntaxError(`Failed to parse key "${e}", expected string, got ${typeof e}`)}if(e.trim()===""){throw new SyntaxError(`Failed to parse key "${e}", expected at least one character`)}if(typeof s!=="string"){const t=JSON.stringify(s);throw new SyntaxError(`Failed to parse value "${t}" for "${e}", expected string, got ${typeof s}`)}if(s.trim()===""){throw new SyntaxError(`Value for key "${e}" cannot be empty (got "${s}")`)}n[e]=s}return n}catch(e){const t=(0,o.errorMessage)(e);throw new Error(`Failed to parse KV pairs as JSON: ${t}`)}}t.parseKVJSON=parseKVJSON;function parseKVYAML(e){if(!e||e.trim().length===0){return{}}const t=i.default.parse(e);const n={};for(const[e,s]of Object.entries(t)){if(typeof e!=="string"||typeof s!=="string"){throw new SyntaxError(`env_vars_file must contain only KEY: VALUE strings. Error parsing key ${e} of type ${typeof e} with value ${s} of type ${typeof s}`)}n[e.trim()]=s.trim()}return n}t.parseKVYAML=parseKVYAML;function parseKVStringAndFile(e,t){e=(e||"").trim();t=(t||"").trim();let n={};if(t){const e=parseKVFile(t);n=Object.assign(Object.assign({},n),e)}if(e){const t=parseKVString(e);n=Object.assign(Object.assign({},n),t)}return n}t.parseKVStringAndFile=parseKVStringAndFile},9497:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.inParallel=void 0;const i=n(2037);function inParallel(e,t,n){return s(this,void 0,void 0,(function*(){const r=Math.min((n===null||n===void 0?void 0:n.concurrency)||(0,i.cpus)().length-1);if(r<1){throw new Error(`concurrency must be at least 1`)}const o=t.map(((e,t)=>({args:e,idx:t})));const a=new Array(t.length);const c=new Array(r).fill(Promise.resolve());const sub=t=>s(this,void 0,void 0,(function*(){const n=o.pop();if(n===undefined){return t}yield t;const s=e.apply(e,n.args);s.then((e=>{a[n.idx]=e}));return sub(s)}));yield Promise.all(c.map(sub));return a}))}t.inParallel=inParallel},5737:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});t.toPlatformPath=t.toWin32Path=t.toPosixPath=void 0;const s=n(1017);function toPosixPath(e){return e.replace(/[\\]/g,"/")}t.toPosixPath=toPosixPath;function toWin32Path(e){return e.replace(/[/]/g,"\\")}t.toWin32Path=toWin32Path;function toPlatformPath(e){return e.replace(/[/\\]/g,s.sep)}t.toPlatformPath=toPlatformPath},570:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});t.randomFilepath=t.randomFilename=void 0;const s=n(1017);const i=n(6113);const r=n(2037);function randomFilename(e=12){return(0,i.randomBytes)(e).toString("hex")}t.randomFilename=randomFilename;function randomFilepath(e=(0,r.tmpdir)(),t=12){return(0,s.join)(e,randomFilename(t))}t.randomFilepath=randomFilepath;t["default"]={randomFilename:randomFilename,randomFilepath:randomFilepath}},1043:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.withRetries=void 0;const i=n(6976);const r=n(7575);const o=100;function withRetries(e,t){var n;const a=t.retries;const c=typeof(t===null||t===void 0?void 0:t.backoffLimit)!=="undefined"?Math.max(t.backoffLimit,0):undefined;let l=(n=t.backoff)!==null&&n!==void 0?n:o;if(typeof c!=="undefined"){l=Math.min(l,c)}return function(){return s(this,void 0,void 0,(function*(){let n=a+1;let s=l;const o=c;let f=0;let u="unknown";do{try{return yield e()}catch(e){u=(0,i.errorMessage)(e);--n;if(n>0){yield(0,r.sleep)(s);let e=f+s;if(typeof o!=="undefined"){e=Math.min(e,Number(o))}f=s;s=e}}}while(n>0);const d=t.retries+1;const h=d===1?`1 attempt`:`${d} attempts`;throw new Error(`retry function failed after ${h}: ${u}`)}))}}t.withRetries=withRetries},9017:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.clearEnv=t.clearInputs=t.setInputs=t.setInput=void 0;function setInput(e,t){const n=`INPUT_${e.replace(/ /g,"_").toUpperCase()}`;process.env[n]=t}t.setInput=setInput;function setInputs(e){Object.entries(e).forEach((([e,t])=>setInput(e,t)))}t.setInputs=setInputs;function clearInputs(){clearEnv((e=>e.startsWith(`INPUT_`)))}t.clearInputs=clearInputs;function clearEnv(e){Object.keys(process.env).forEach((t=>{if(e(t,process.env[t])){delete process.env[t]}}))}t.clearEnv=clearEnv},7575:function(e,t){var n=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.sleep=t.parseDuration=void 0;function parseDuration(e){e=(e||"").trim();if(!e){return 0}let t=0;let n="";for(let s=0;s<e.length;s++){const i=e[s];switch(i){case" ":continue;case",":continue;case"s":{t+=+n;n="";break}case"m":{t+=+n*60;n="";break}case"h":{t+=+n*60*60;n="";break}case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":n+=i;break;default:throw new SyntaxError(`Unsupported character "${i}" at position ${s}`)}}if(n){t+=+n}return t}t.parseDuration=parseDuration;function sleep(e=0){return n(this,void 0,void 0,(function*(){return new Promise((t=>setTimeout(t,e)))}))}t.sleep=sleep},596:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.allOf=t.exactlyOneOf=t.presence=void 0;function presence(e){return(e||"").trim()||undefined}t.presence=presence;function exactlyOneOf(...e){e=e||[];let t=false;for(let n=0;n<e.length;n++){if(e[n]){if(t){return false}else{t=true}}}if(!t){return false}return true}t.exactlyOneOf=exactlyOneOf;function allOf(...e){e=e||[];for(let t=0;t<e.length;t++){if(!e[t])return false}return true}t.allOf=allOf},9324:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.pinnedToHeadWarning=t.isPinnedToHead=void 0;function isPinnedToHead(){const e=process.env.GITHUB_ACTION_REF;return e==="master"||e==="main"}t.isPinnedToHead=isPinnedToHead;function pinnedToHeadWarning(e){const t=process.env.GITHUB_ACTION_REF;const n=process.env.GITHUB_ACTION_REPOSITORY;return`${n} is pinned at "${t}". We strongly advise against `+`pinning to "@${t}" as it may be unstable. Please update your `+`GitHub Action YAML from:\n`+`\n`+`    uses: '${n}@${t}'\n`+`\n`+`to:\n`+`\n`+`    uses: '${n}@${e}'\n`+`\n`+`Alternatively, you can pin to any git tag or git SHA in the repository.`}t.pinnedToHeadWarning=pinnedToHeadWarning},6113:e=>{e.exports=__nccwpck_require__(6113)},7147:e=>{e.exports=__nccwpck_require__(7147)},2037:e=>{e.exports=__nccwpck_require__(2037)},1017:e=>{e.exports=__nccwpck_require__(1017)},4655:e=>{e.exports=__nccwpck_require__(4655)},8109:(e,t,n)=>{var s=n(1399);var i=n(9338);var r=n(2986);var o=n(2289);var a=n(45);function composeCollection(e,t,n,c,l){let f;switch(n.type){case"block-map":{f=r.resolveBlockMap(e,t,n,l);break}case"block-seq":{f=o.resolveBlockSeq(e,t,n,l);break}case"flow-collection":{f=a.resolveFlowCollection(e,t,n,l);break}}if(!c)return f;const u=t.directives.tagName(c.source,(e=>l(c,"TAG_RESOLVE_FAILED",e)));if(!u)return f;const d=f.constructor;if(u==="!"||u===d.tagName){f.tag=d.tagName;return f}const h=s.isMap(f)?"map":"seq";let p=t.schema.tags.find((e=>e.collection===h&&e.tag===u));if(!p){const e=t.schema.knownTags[u];if(e&&e.collection===h){t.schema.tags.push(Object.assign({},e,{default:false}));p=e}else{l(c,"TAG_RESOLVE_FAILED",`Unresolved tag: ${u}`,true);f.tag=u;return f}}const m=p.resolve(f,(e=>l(c,"TAG_RESOLVE_FAILED",e)),t.options);const y=s.isNode(m)?m:new i.Scalar(m);y.range=f.range;y.tag=u;if(p?.format)y.format=p.format;return y}t.composeCollection=composeCollection},5050:(e,t,n)=>{var s=n(42);var i=n(8676);var r=n(1250);var o=n(6985);function composeDoc(e,t,{offset:n,start:a,value:c,end:l},f){const u=Object.assign({_directives:t},e);const d=new s.Document(undefined,u);const h={atRoot:true,directives:d.directives,options:d.options,schema:d.schema};const p=o.resolveProps(a,{indicator:"doc-start",next:c??l?.[0],offset:n,onError:f,startOnNewline:true});if(p.found){d.directives.docStart=true;if(c&&(c.type==="block-map"||c.type==="block-seq")&&!p.hasNewline)f(p.end,"MISSING_CHAR","Block collection cannot start on same line with directives-end marker")}d.contents=c?i.composeNode(h,c,p,f):i.composeEmptyNode(h,p.end,a,null,p,f);const m=d.contents.range[2];const y=r.resolveEnd(l,m,false,f);if(y.comment)d.comment=y.comment;d.range=[n,m,y.offset];return d}t.composeDoc=composeDoc},8676:(e,t,n)=>{var s=n(5639);var i=n(8109);var r=n(4766);var o=n(1250);var a=n(8781);const c={composeNode:composeNode,composeEmptyNode:composeEmptyNode};function composeNode(e,t,n,s){const{spaceBefore:o,comment:a,anchor:l,tag:f}=n;let u;let d=true;switch(t.type){case"alias":u=composeAlias(e,t,s);if(l||f)s(t,"ALIAS_PROPS","An alias node must not specify any properties");break;case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":case"block-scalar":u=r.composeScalar(e,t,f,s);if(l)u.anchor=l.source.substring(1);break;case"block-map":case"block-seq":case"flow-collection":u=i.composeCollection(c,e,t,f,s);if(l)u.anchor=l.source.substring(1);break;default:{const i=t.type==="error"?t.message:`Unsupported token (type: ${t.type})`;s(t,"UNEXPECTED_TOKEN",i);u=composeEmptyNode(e,t.offset,undefined,null,n,s);d=false}}if(l&&u.anchor==="")s(l,"BAD_ALIAS","Anchor cannot be an empty string");if(o)u.spaceBefore=true;if(a){if(t.type==="scalar"&&t.source==="")u.comment=a;else u.commentBefore=a}if(e.options.keepSourceTokens&&d)u.srcToken=t;return u}function composeEmptyNode(e,t,n,s,{spaceBefore:i,comment:o,anchor:c,tag:l,end:f},u){const d={type:"scalar",offset:a.emptyScalarPosition(t,n,s),indent:-1,source:""};const h=r.composeScalar(e,d,l,u);if(c){h.anchor=c.source.substring(1);if(h.anchor==="")u(c,"BAD_ALIAS","Anchor cannot be an empty string")}if(i)h.spaceBefore=true;if(o){h.comment=o;h.range[2]=f}return h}function composeAlias({options:e},{offset:t,source:n,end:i},r){const a=new s.Alias(n.substring(1));if(a.source==="")r(t,"BAD_ALIAS","Alias cannot be an empty string");if(a.source.endsWith(":"))r(t+n.length-1,"BAD_ALIAS","Alias ending in : is ambiguous",true);const c=t+n.length;const l=o.resolveEnd(i,c,e.strict,r);a.range=[t,c,l.offset];if(l.comment)a.comment=l.comment;return a}t.composeEmptyNode=composeEmptyNode;t.composeNode=composeNode},4766:(e,t,n)=>{var s=n(1399);var i=n(9338);var r=n(9485);var o=n(7578);function composeScalar(e,t,n,a){const{value:c,type:l,comment:f,range:u}=t.type==="block-scalar"?r.resolveBlockScalar(t,e.options.strict,a):o.resolveFlowScalar(t,e.options.strict,a);const d=n?e.directives.tagName(n.source,(e=>a(n,"TAG_RESOLVE_FAILED",e))):null;const h=n&&d?findScalarTagByName(e.schema,c,d,n,a):t.type==="scalar"?findScalarTagByTest(e,c,t,a):e.schema[s.SCALAR];let p;try{const r=h.resolve(c,(e=>a(n??t,"TAG_RESOLVE_FAILED",e)),e.options);p=s.isScalar(r)?r:new i.Scalar(r)}catch(e){const s=e instanceof Error?e.message:String(e);a(n??t,"TAG_RESOLVE_FAILED",s);p=new i.Scalar(c)}p.range=u;p.source=c;if(l)p.type=l;if(d)p.tag=d;if(h.format)p.format=h.format;if(f)p.comment=f;return p}function findScalarTagByName(e,t,n,i,r){if(n==="!")return e[s.SCALAR];const o=[];for(const t of e.tags){if(!t.collection&&t.tag===n){if(t.default&&t.test)o.push(t);else return t}}for(const e of o)if(e.test?.test(t))return e;const a=e.knownTags[n];if(a&&!a.collection){e.tags.push(Object.assign({},a,{default:false,test:undefined}));return a}r(i,"TAG_RESOLVE_FAILED",`Unresolved tag: ${n}`,n!=="tag:yaml.org,2002:str");return e[s.SCALAR]}function findScalarTagByTest({directives:e,schema:t},n,i,r){const o=t.tags.find((e=>e.default&&e.test?.test(n)))||t[s.SCALAR];if(t.compat){const a=t.compat.find((e=>e.default&&e.test?.test(n)))??t[s.SCALAR];if(o.tag!==a.tag){const t=e.tagString(o.tag);const n=e.tagString(a.tag);const s=`Value may be parsed as either ${t} or ${n}`;r(i,"TAG_RESOLVE_FAILED",s,true)}}return o}t.composeScalar=composeScalar},9493:(e,t,n)=>{var s=n(5400);var i=n(42);var r=n(4236);var o=n(1399);var a=n(5050);var c=n(1250);function getErrorPos(e){if(typeof e==="number")return[e,e+1];if(Array.isArray(e))return e.length===2?e:[e[0],e[1]];const{offset:t,source:n}=e;return[t,t+(typeof n==="string"?n.length:1)]}function parsePrelude(e){let t="";let n=false;let s=false;for(let i=0;i<e.length;++i){const r=e[i];switch(r[0]){case"#":t+=(t===""?"":s?"\n\n":"\n")+(r.substring(1)||" ");n=true;s=false;break;case"%":if(e[i+1]?.[0]!=="#")i+=1;n=false;break;default:if(!n)s=true;n=false}}return{comment:t,afterEmptyLine:s}}class Composer{constructor(e={}){this.doc=null;this.atDirectives=false;this.prelude=[];this.errors=[];this.warnings=[];this.onError=(e,t,n,s)=>{const i=getErrorPos(e);if(s)this.warnings.push(new r.YAMLWarning(i,t,n));else this.errors.push(new r.YAMLParseError(i,t,n))};this.directives=new s.Directives({version:e.version||"1.2"});this.options=e}decorate(e,t){const{comment:n,afterEmptyLine:s}=parsePrelude(this.prelude);if(n){const i=e.contents;if(t){e.comment=e.comment?`${e.comment}\n${n}`:n}else if(s||e.directives.docStart||!i){e.commentBefore=n}else if(o.isCollection(i)&&!i.flow&&i.items.length>0){let e=i.items[0];if(o.isPair(e))e=e.key;const t=e.commentBefore;e.commentBefore=t?`${n}\n${t}`:n}else{const e=i.commentBefore;i.commentBefore=e?`${n}\n${e}`:n}}if(t){Array.prototype.push.apply(e.errors,this.errors);Array.prototype.push.apply(e.warnings,this.warnings)}else{e.errors=this.errors;e.warnings=this.warnings}this.prelude=[];this.errors=[];this.warnings=[]}streamInfo(){return{comment:parsePrelude(this.prelude).comment,directives:this.directives,errors:this.errors,warnings:this.warnings}}*compose(e,t=false,n=-1){for(const t of e)yield*this.next(t);yield*this.end(t,n)}*next(e){if(process.env.LOG_STREAM)console.dir(e,{depth:null});switch(e.type){case"directive":this.directives.add(e.source,((t,n,s)=>{const i=getErrorPos(e);i[0]+=t;this.onError(i,"BAD_DIRECTIVE",n,s)}));this.prelude.push(e.source);this.atDirectives=true;break;case"document":{const t=a.composeDoc(this.options,this.directives,e,this.onError);if(this.atDirectives&&!t.directives.docStart)this.onError(e,"MISSING_CHAR","Missing directives-end/doc-start indicator line");this.decorate(t,false);if(this.doc)yield this.doc;this.doc=t;this.atDirectives=false;break}case"byte-order-mark":case"space":break;case"comment":case"newline":this.prelude.push(e.source);break;case"error":{const t=e.source?`${e.message}: ${JSON.stringify(e.source)}`:e.message;const n=new r.YAMLParseError(getErrorPos(e),"UNEXPECTED_TOKEN",t);if(this.atDirectives||!this.doc)this.errors.push(n);else this.doc.errors.push(n);break}case"doc-end":{if(!this.doc){const t="Unexpected doc-end without preceding document";this.errors.push(new r.YAMLParseError(getErrorPos(e),"UNEXPECTED_TOKEN",t));break}this.doc.directives.docEnd=true;const t=c.resolveEnd(e.end,e.offset+e.source.length,this.doc.options.strict,this.onError);this.decorate(this.doc,true);if(t.comment){const e=this.doc.comment;this.doc.comment=e?`${e}\n${t.comment}`:t.comment}this.doc.range[2]=t.offset;break}default:this.errors.push(new r.YAMLParseError(getErrorPos(e),"UNEXPECTED_TOKEN",`Unsupported token ${e.type}`))}}*end(e=false,t=-1){if(this.doc){this.decorate(this.doc,true);yield this.doc;this.doc=null}else if(e){const e=Object.assign({_directives:this.directives},this.options);const n=new i.Document(undefined,e);if(this.atDirectives)this.onError(t,"MISSING_CHAR","Missing directives-end indicator line");n.range=[0,t,t];this.decorate(n,false);yield n}}}t.Composer=Composer},2986:(e,t,n)=>{var s=n(246);var i=n(6011);var r=n(6985);var o=n(976);var a=n(3669);var c=n(6899);const l="All mapping items must start at the same column";function resolveBlockMap({composeNode:e,composeEmptyNode:t},n,f,u){const d=new i.YAMLMap(n.schema);if(n.atRoot)n.atRoot=false;let h=f.offset;let p=null;for(const i of f.items){const{start:m,key:y,sep:g,value:v}=i;const b=r.resolveProps(m,{indicator:"explicit-key-ind",next:y??g?.[0],offset:h,onError:u,startOnNewline:true});const S=!b.found;if(S){if(y){if(y.type==="block-seq")u(h,"BLOCK_AS_IMPLICIT_KEY","A block sequence may not be used as an implicit map key");else if("indent"in y&&y.indent!==f.indent)u(h,"BAD_INDENT",l)}if(!b.anchor&&!b.tag&&!g){p=b.end;if(b.comment){if(d.comment)d.comment+="\n"+b.comment;else d.comment=b.comment}continue}if(b.hasNewlineAfterProp||o.containsNewline(y)){u(y??m[m.length-1],"MULTILINE_IMPLICIT_KEY","Implicit keys need to be on a single line")}}else if(b.found?.indent!==f.indent){u(h,"BAD_INDENT",l)}const w=b.end;const k=y?e(n,y,b,u):t(n,w,m,null,b,u);if(n.schema.compat)a.flowIndentCheck(f.indent,y,u);if(c.mapIncludes(n,d.items,k))u(w,"DUPLICATE_KEY","Map keys must be unique");const E=r.resolveProps(g??[],{indicator:"map-value-ind",next:v,offset:k.range[2],onError:u,startOnNewline:!y||y.type==="block-scalar"});h=E.end;if(E.found){if(S){if(v?.type==="block-map"&&!E.hasNewline)u(h,"BLOCK_AS_IMPLICIT_KEY","Nested mappings are not allowed in compact mappings");if(n.options.strict&&b.start<E.found.offset-1024)u(k.range,"KEY_OVER_1024_CHARS","The : indicator must be at most 1024 chars after the start of an implicit block mapping key")}const r=v?e(n,v,E,u):t(n,h,g,null,E,u);if(n.schema.compat)a.flowIndentCheck(f.indent,v,u);h=r.range[2];const o=new s.Pair(k,r);if(n.options.keepSourceTokens)o.srcToken=i;d.items.push(o)}else{if(S)u(k.range,"MISSING_CHAR","Implicit map keys need to be followed by map values");if(E.comment){if(k.comment)k.comment+="\n"+E.comment;else k.comment=E.comment}const e=new s.Pair(k);if(n.options.keepSourceTokens)e.srcToken=i;d.items.push(e)}}if(p&&p<h)u(p,"IMPOSSIBLE","Map comment with trailing content");d.range=[f.offset,h,p??h];return d}t.resolveBlockMap=resolveBlockMap},9485:(e,t,n)=>{var s=n(9338);function resolveBlockScalar(e,t,n){const i=e.offset;const r=parseBlockScalarHeader(e,t,n);if(!r)return{value:"",type:null,comment:"",range:[i,i,i]};const o=r.mode===">"?s.Scalar.BLOCK_FOLDED:s.Scalar.BLOCK_LITERAL;const a=e.source?splitLines(e.source):[];let c=a.length;for(let e=a.length-1;e>=0;--e){const t=a[e][1];if(t===""||t==="\r")c=e;else break}if(c===0){const t=r.chomp==="+"&&a.length>0?"\n".repeat(Math.max(1,a.length-1)):"";let n=i+r.length;if(e.source)n+=e.source.length;return{value:t,type:o,comment:r.comment,range:[i,n,n]}}let l=e.indent+r.indent;let f=e.offset+r.length;let u=0;for(let e=0;e<c;++e){const[t,s]=a[e];if(s===""||s==="\r"){if(r.indent===0&&t.length>l)l=t.length}else{if(t.length<l){const e="Block scalars with more-indented leading empty lines must use an explicit indentation indicator";n(f+t.length,"MISSING_CHAR",e)}if(r.indent===0)l=t.length;u=e;break}f+=t.length+s.length+1}for(let e=a.length-1;e>=c;--e){if(a[e][0].length>l)c=e+1}let d="";let h="";let p=false;for(let e=0;e<u;++e)d+=a[e][0].slice(l)+"\n";for(let e=u;e<c;++e){let[t,i]=a[e];f+=t.length+i.length+1;const c=i[i.length-1]==="\r";if(c)i=i.slice(0,-1);if(i&&t.length<l){const e=r.indent?"explicit indentation indicator":"first line";const s=`Block scalar lines must not be less indented than their ${e}`;n(f-i.length-(c?2:1),"BAD_INDENT",s);t=""}if(o===s.Scalar.BLOCK_LITERAL){d+=h+t.slice(l)+i;h="\n"}else if(t.length>l||i[0]==="\t"){if(h===" ")h="\n";else if(!p&&h==="\n")h="\n\n";d+=h+t.slice(l)+i;h="\n";p=true}else if(i===""){if(h==="\n")d+="\n";else h="\n"}else{d+=h+i;h=" ";p=false}}switch(r.chomp){case"-":break;case"+":for(let e=c;e<a.length;++e)d+="\n"+a[e][0].slice(l);if(d[d.length-1]!=="\n")d+="\n";break;default:d+="\n"}const m=i+r.length+e.source.length;return{value:d,type:o,comment:r.comment,range:[i,m,m]}}function parseBlockScalarHeader({offset:e,props:t},n,s){if(t[0].type!=="block-scalar-header"){s(t[0],"IMPOSSIBLE","Block scalar header not found");return null}const{source:i}=t[0];const r=i[0];let o=0;let a="";let c=-1;for(let t=1;t<i.length;++t){const n=i[t];if(!a&&(n==="-"||n==="+"))a=n;else{const s=Number(n);if(!o&&s)o=s;else if(c===-1)c=e+t}}if(c!==-1)s(c,"UNEXPECTED_TOKEN",`Block scalar header includes extra characters: ${i}`);let l=false;let f="";let u=i.length;for(let e=1;e<t.length;++e){const i=t[e];switch(i.type){case"space":l=true;case"newline":u+=i.source.length;break;case"comment":if(n&&!l){const e="Comments must be separated from other tokens by white space characters";s(i,"MISSING_CHAR",e)}u+=i.source.length;f=i.source.substring(1);break;case"error":s(i,"UNEXPECTED_TOKEN",i.message);u+=i.source.length;break;default:{const e=`Unexpected token in block scalar header: ${i.type}`;s(i,"UNEXPECTED_TOKEN",e);const t=i.source;if(t&&typeof t==="string")u+=t.length}}}return{mode:r,indent:o,chomp:a,comment:f,length:u}}function splitLines(e){const t=e.split(/\n( *)/);const n=t[0];const s=n.match(/^( *)/);const i=s?.[1]?[s[1],n.slice(s[1].length)]:["",n];const r=[i];for(let e=1;e<t.length;e+=2)r.push([t[e],t[e+1]]);return r}t.resolveBlockScalar=resolveBlockScalar},2289:(e,t,n)=>{var s=n(5161);var i=n(6985);var r=n(3669);function resolveBlockSeq({composeNode:e,composeEmptyNode:t},n,o,a){const c=new s.YAMLSeq(n.schema);if(n.atRoot)n.atRoot=false;let l=o.offset;let f=null;for(const{start:s,value:u}of o.items){const d=i.resolveProps(s,{indicator:"seq-item-ind",next:u,offset:l,onError:a,startOnNewline:true});if(!d.found){if(d.anchor||d.tag||u){if(u&&u.type==="block-seq")a(d.end,"BAD_INDENT","All sequence items must start at the same column");else a(l,"MISSING_CHAR","Sequence item without - indicator")}else{f=d.end;if(d.comment)c.comment=d.comment;continue}}const h=u?e(n,u,d,a):t(n,d.end,s,null,d,a);if(n.schema.compat)r.flowIndentCheck(o.indent,u,a);l=h.range[2];c.items.push(h)}c.range=[o.offset,l,f??l];return c}t.resolveBlockSeq=resolveBlockSeq},1250:(e,t)=>{function resolveEnd(e,t,n,s){let i="";if(e){let r=false;let o="";for(const a of e){const{source:e,type:c}=a;switch(c){case"space":r=true;break;case"comment":{if(n&&!r)s(a,"MISSING_CHAR","Comments must be separated from other tokens by white space characters");const t=e.substring(1)||" ";if(!i)i=t;else i+=o+t;o="";break}case"newline":if(i)o+=e;r=true;break;default:s(a,"UNEXPECTED_TOKEN",`Unexpected ${c} at node end`)}t+=e.length}}return{comment:i,offset:t}}t.resolveEnd=resolveEnd},45:(e,t,n)=>{var s=n(1399);var i=n(246);var r=n(6011);var o=n(5161);var a=n(1250);var c=n(6985);var l=n(976);var f=n(6899);const u="Block collections are not allowed within flow collections";const isBlock=e=>e&&(e.type==="block-map"||e.type==="block-seq");function resolveFlowCollection({composeNode:e,composeEmptyNode:t},n,d,h){const p=d.start.source==="{";const m=p?"flow map":"flow sequence";const y=p?new r.YAMLMap(n.schema):new o.YAMLSeq(n.schema);y.flow=true;const g=n.atRoot;if(g)n.atRoot=false;let v=d.offset+d.start.source.length;for(let o=0;o<d.items.length;++o){const a=d.items[o];const{start:g,key:b,sep:S,value:w}=a;const k=c.resolveProps(g,{flow:m,indicator:"explicit-key-ind",next:b??S?.[0],offset:v,onError:h,startOnNewline:false});if(!k.found){if(!k.anchor&&!k.tag&&!S&&!w){if(o===0&&k.comma)h(k.comma,"UNEXPECTED_TOKEN",`Unexpected , in ${m}`);else if(o<d.items.length-1)h(k.start,"UNEXPECTED_TOKEN",`Unexpected empty item in ${m}`);if(k.comment){if(y.comment)y.comment+="\n"+k.comment;else y.comment=k.comment}v=k.end;continue}if(!p&&n.options.strict&&l.containsNewline(b))h(b,"MULTILINE_IMPLICIT_KEY","Implicit keys of flow sequence pairs need to be on a single line")}if(o===0){if(k.comma)h(k.comma,"UNEXPECTED_TOKEN",`Unexpected , in ${m}`)}else{if(!k.comma)h(k.start,"MISSING_CHAR",`Missing , between ${m} items`);if(k.comment){let e="";e:for(const t of g){switch(t.type){case"comma":case"space":break;case"comment":e=t.source.substring(1);break e;default:break e}}if(e){let t=y.items[y.items.length-1];if(s.isPair(t))t=t.value??t.key;if(t.comment)t.comment+="\n"+e;else t.comment=e;k.comment=k.comment.substring(e.length+1)}}}if(!p&&!S&&!k.found){const s=w?e(n,w,k,h):t(n,k.end,S,null,k,h);y.items.push(s);v=s.range[2];if(isBlock(w))h(s.range,"BLOCK_IN_FLOW",u)}else{const s=k.end;const o=b?e(n,b,k,h):t(n,s,g,null,k,h);if(isBlock(b))h(o.range,"BLOCK_IN_FLOW",u);const l=c.resolveProps(S??[],{flow:m,indicator:"map-value-ind",next:w,offset:o.range[2],onError:h,startOnNewline:false});if(l.found){if(!p&&!k.found&&n.options.strict){if(S)for(const e of S){if(e===l.found)break;if(e.type==="newline"){h(e,"MULTILINE_IMPLICIT_KEY","Implicit keys of flow sequence pairs need to be on a single line");break}}if(k.start<l.found.offset-1024)h(l.found,"KEY_OVER_1024_CHARS","The : indicator must be at most 1024 chars after the start of an implicit flow sequence key")}}else if(w){if("source"in w&&w.source&&w.source[0]===":")h(w,"MISSING_CHAR",`Missing space after : in ${m}`);else h(l.start,"MISSING_CHAR",`Missing , or : between ${m} items`)}const d=w?e(n,w,l,h):l.found?t(n,l.end,S,null,l,h):null;if(d){if(isBlock(w))h(d.range,"BLOCK_IN_FLOW",u)}else if(l.comment){if(o.comment)o.comment+="\n"+l.comment;else o.comment=l.comment}const E=new i.Pair(o,d);if(n.options.keepSourceTokens)E.srcToken=a;if(p){const e=y;if(f.mapIncludes(n,e.items,o))h(s,"DUPLICATE_KEY","Map keys must be unique");e.items.push(E)}else{const e=new r.YAMLMap(n.schema);e.flow=true;e.items.push(E);y.items.push(e)}v=d?d.range[2]:l.end}}const b=p?"}":"]";const[S,...w]=d.end;let k=v;if(S&&S.source===b)k=S.offset+S.source.length;else{const e=m[0].toUpperCase()+m.substring(1);const t=g?`${e} must end with a ${b}`:`${e} in block collection must be sufficiently indented and end with a ${b}`;h(v,g?"MISSING_CHAR":"BAD_INDENT",t);if(S&&S.source.length!==1)w.unshift(S)}if(w.length>0){const e=a.resolveEnd(w,k,n.options.strict,h);if(e.comment){if(y.comment)y.comment+="\n"+e.comment;else y.comment=e.comment}y.range=[d.offset,k,e.offset]}else{y.range=[d.offset,k,k]}return y}t.resolveFlowCollection=resolveFlowCollection},7578:(e,t,n)=>{var s=n(9338);var i=n(1250);function resolveFlowScalar(e,t,n){const{offset:r,type:o,source:a,end:c}=e;let l;let f;const _onError=(e,t,s)=>n(r+e,t,s);switch(o){case"scalar":l=s.Scalar.PLAIN;f=plainValue(a,_onError);break;case"single-quoted-scalar":l=s.Scalar.QUOTE_SINGLE;f=singleQuotedValue(a,_onError);break;case"double-quoted-scalar":l=s.Scalar.QUOTE_DOUBLE;f=doubleQuotedValue(a,_onError);break;default:n(e,"UNEXPECTED_TOKEN",`Expected a flow scalar value, but found: ${o}`);return{value:"",type:null,comment:"",range:[r,r+a.length,r+a.length]}}const u=r+a.length;const d=i.resolveEnd(c,u,t,n);return{value:f,type:l,comment:d.comment,range:[r,u,d.offset]}}function plainValue(e,t){let n="";switch(e[0]){case"\t":n="a tab character";break;case",":n="flow indicator character ,";break;case"%":n="directive indicator character %";break;case"|":case">":{n=`block scalar indicator ${e[0]}`;break}case"@":case"`":{n=`reserved character ${e[0]}`;break}}if(n)t(0,"BAD_SCALAR_START",`Plain value cannot start with ${n}`);return foldLines(e)}function singleQuotedValue(e,t){if(e[e.length-1]!=="'"||e.length===1)t(e.length,"MISSING_CHAR","Missing closing 'quote");return foldLines(e.slice(1,-1)).replace(/''/g,"'")}function foldLines(e){let t,n;try{t=new RegExp("(.*?)(?<![ \t])[ \t]*\r?\n","sy");n=new RegExp("[ \t]*(.*?)(?:(?<![ \t])[ \t]*)?\r?\n","sy")}catch(e){t=/(.*?)[ \t]*\r?\n/ys;n=/[ \t]*(.*?)[ \t]*\r?\n/ys}let s=t.exec(e);if(!s)return e;let i=s[1];let r=" ";let o=t.lastIndex;n.lastIndex=o;while(s=n.exec(e)){if(s[1]===""){if(r==="\n")i+=r;else r="\n"}else{i+=r+s[1];r=" "}o=n.lastIndex}const a=/[ \t]*(.*)/ys;a.lastIndex=o;s=a.exec(e);return i+r+(s?.[1]??"")}function doubleQuotedValue(e,t){let n="";for(let s=1;s<e.length-1;++s){const i=e[s];if(i==="\r"&&e[s+1]==="\n")continue;if(i==="\n"){const{fold:t,offset:i}=foldNewline(e,s);n+=t;s=i}else if(i==="\\"){let i=e[++s];const o=r[i];if(o)n+=o;else if(i==="\n"){i=e[s+1];while(i===" "||i==="\t")i=e[++s+1]}else if(i==="\r"&&e[s+1]==="\n"){i=e[++s+1];while(i===" "||i==="\t")i=e[++s+1]}else if(i==="x"||i==="u"||i==="U"){const r={x:2,u:4,U:8}[i];n+=parseCharCode(e,s+1,r,t);s+=r}else{const i=e.substr(s-1,2);t(s-1,"BAD_DQ_ESCAPE",`Invalid escape sequence ${i}`);n+=i}}else if(i===" "||i==="\t"){const t=s;let r=e[s+1];while(r===" "||r==="\t")r=e[++s+1];if(r!=="\n"&&!(r==="\r"&&e[s+2]==="\n"))n+=s>t?e.slice(t,s+1):i}else{n+=i}}if(e[e.length-1]!=='"'||e.length===1)t(e.length,"MISSING_CHAR",'Missing closing "quote');return n}function foldNewline(e,t){let n="";let s=e[t+1];while(s===" "||s==="\t"||s==="\n"||s==="\r"){if(s==="\r"&&e[t+2]!=="\n")break;if(s==="\n")n+="\n";t+=1;s=e[t+1]}if(!n)n=" ";return{fold:n,offset:t}}const r={0:"\0",a:"",b:"\b",e:"",f:"\f",n:"\n",r:"\r",t:"\t",v:"\v",N:"",_:" ",L:"\u2028",P:"\u2029"," ":" ",'"':'"',"/":"/","\\":"\\","\t":"\t"};function parseCharCode(e,t,n,s){const i=e.substr(t,n);const r=i.length===n&&/^[0-9a-fA-F]+$/.test(i);const o=r?parseInt(i,16):NaN;if(isNaN(o)){const i=e.substr(t-2,n+2);s(t-2,"BAD_DQ_ESCAPE",`Invalid escape sequence ${i}`);return i}return String.fromCodePoint(o)}t.resolveFlowScalar=resolveFlowScalar},6985:(e,t)=>{function resolveProps(e,{flow:t,indicator:n,next:s,offset:i,onError:r,startOnNewline:o}){let a=false;let c=o;let l=o;let f="";let u="";let d=false;let h=false;let p=false;let m=null;let y=null;let g=null;let v=null;let b=null;for(const s of e){if(p){if(s.type!=="space"&&s.type!=="newline"&&s.type!=="comma")r(s.offset,"MISSING_CHAR","Tags and anchors must be separated from the next token by white space");p=false}switch(s.type){case"space":if(!t&&c&&n!=="doc-start"&&s.source[0]==="\t")r(s,"TAB_AS_INDENT","Tabs are not allowed as indentation");l=true;break;case"comment":{if(!l)r(s,"MISSING_CHAR","Comments must be separated from other tokens by white space characters");const e=s.source.substring(1)||" ";if(!f)f=e;else f+=u+e;u="";c=false;break}case"newline":if(c){if(f)f+=s.source;else a=true}else u+=s.source;c=true;d=true;if(m||y)h=true;l=true;break;case"anchor":if(m)r(s,"MULTIPLE_ANCHORS","A node can have at most one anchor");if(s.source.endsWith(":"))r(s.offset+s.source.length-1,"BAD_ALIAS","Anchor ending in : is ambiguous",true);m=s;if(b===null)b=s.offset;c=false;l=false;p=true;break;case"tag":{if(y)r(s,"MULTIPLE_TAGS","A node can have at most one tag");y=s;if(b===null)b=s.offset;c=false;l=false;p=true;break}case n:if(m||y)r(s,"BAD_PROP_ORDER",`Anchors and tags must be after the ${s.source} indicator`);if(v)r(s,"UNEXPECTED_TOKEN",`Unexpected ${s.source} in ${t??"collection"}`);v=s;c=false;l=false;break;case"comma":if(t){if(g)r(s,"UNEXPECTED_TOKEN",`Unexpected , in ${t}`);g=s;c=false;l=false;break}default:r(s,"UNEXPECTED_TOKEN",`Unexpected ${s.type} token`);c=false;l=false}}const S=e[e.length-1];const w=S?S.offset+S.source.length:i;if(p&&s&&s.type!=="space"&&s.type!=="newline"&&s.type!=="comma"&&(s.type!=="scalar"||s.source!==""))r(s.offset,"MISSING_CHAR","Tags and anchors must be separated from the next token by white space");return{comma:g,found:v,spaceBefore:a,comment:f,hasNewline:d,hasNewlineAfterProp:h,anchor:m,tag:y,end:w,start:b??w}}t.resolveProps=resolveProps},976:(e,t)=>{function containsNewline(e){if(!e)return null;switch(e.type){case"alias":case"scalar":case"double-quoted-scalar":case"single-quoted-scalar":if(e.source.includes("\n"))return true;if(e.end)for(const t of e.end)if(t.type==="newline")return true;return false;case"flow-collection":for(const t of e.items){for(const e of t.start)if(e.type==="newline")return true;if(t.sep)for(const e of t.sep)if(e.type==="newline")return true;if(containsNewline(t.key)||containsNewline(t.value))return true}return false;default:return true}}t.containsNewline=containsNewline},8781:(e,t)=>{function emptyScalarPosition(e,t,n){if(t){if(n===null)n=t.length;for(let s=n-1;s>=0;--s){let n=t[s];switch(n.type){case"space":case"comment":case"newline":e-=n.source.length;continue}n=t[++s];while(n?.type==="space"){e+=n.source.length;n=t[++s]}break}}return e}t.emptyScalarPosition=emptyScalarPosition},3669:(e,t,n)=>{var s=n(976);function flowIndentCheck(e,t,n){if(t?.type==="flow-collection"){const i=t.end[0];if(i.indent===e&&(i.source==="]"||i.source==="}")&&s.containsNewline(t)){const e="Flow end indicator should be more indented than parent";n(i,"BAD_INDENT",e,true)}}}t.flowIndentCheck=flowIndentCheck},6899:(e,t,n)=>{var s=n(1399);function mapIncludes(e,t,n){const{uniqueKeys:i}=e.options;if(i===false)return false;const r=typeof i==="function"?i:(t,n)=>t===n||s.isScalar(t)&&s.isScalar(n)&&t.value===n.value&&!(t.value==="<<"&&e.schema.merge);return t.some((e=>r(e.key,n)))}t.mapIncludes=mapIncludes},42:(e,t,n)=>{var s=n(5639);var i=n(3466);var r=n(1399);var o=n(246);var a=n(2463);var c=n(6831);var l=n(8409);var f=n(5225);var u=n(8459);var d=n(3412);var h=n(9652);var p=n(5400);class Document{constructor(e,t,n){this.commentBefore=null;this.comment=null;this.errors=[];this.warnings=[];Object.defineProperty(this,r.NODE_TYPE,{value:r.DOC});let s=null;if(typeof t==="function"||Array.isArray(t)){s=t}else if(n===undefined&&t){n=t;t=undefined}const i=Object.assign({intAsBigInt:false,keepSourceTokens:false,logLevel:"warn",prettyErrors:true,strict:true,uniqueKeys:true,version:"1.2"},n);this.options=i;let{version:o}=i;if(n?._directives){this.directives=n._directives.atDocument();if(this.directives.yaml.explicit)o=this.directives.yaml.version}else this.directives=new p.Directives({version:o});this.setSchema(o,n);if(e===undefined)this.contents=null;else{this.contents=this.createNode(e,s,n)}}clone(){const e=Object.create(Document.prototype,{[r.NODE_TYPE]:{value:r.DOC}});e.commentBefore=this.commentBefore;e.comment=this.comment;e.errors=this.errors.slice();e.warnings=this.warnings.slice();e.options=Object.assign({},this.options);if(this.directives)e.directives=this.directives.clone();e.schema=this.schema.clone();e.contents=r.isNode(this.contents)?this.contents.clone(e.schema):this.contents;if(this.range)e.range=this.range.slice();return e}add(e){if(assertCollection(this.contents))this.contents.add(e)}addIn(e,t){if(assertCollection(this.contents))this.contents.addIn(e,t)}createAlias(e,t){if(!e.anchor){const n=u.anchorNames(this);e.anchor=!t||n.has(t)?u.findNewAnchor(t||"a",n):t}return new s.Alias(e.anchor)}createNode(e,t,n){let s=undefined;if(typeof t==="function"){e=t.call({"":e},"",e);s=t}else if(Array.isArray(t)){const keyToStr=e=>typeof e==="number"||e instanceof String||e instanceof Number;const e=t.filter(keyToStr).map(String);if(e.length>0)t=t.concat(e);s=t}else if(n===undefined&&t){n=t;t=undefined}const{aliasDuplicateObjects:i,anchorPrefix:o,flow:a,keepUndefined:c,onTagObj:l,tag:f}=n??{};const{onAnchor:d,setAnchors:p,sourceObjects:m}=u.createNodeAnchors(this,o||"a");const y={aliasDuplicateObjects:i??true,keepUndefined:c??false,onAnchor:d,onTagObj:l,replacer:s,schema:this.schema,sourceObjects:m};const g=h.createNode(e,f,y);if(a&&r.isCollection(g))g.flow=true;p();return g}createPair(e,t,n={}){const s=this.createNode(e,null,n);const i=this.createNode(t,null,n);return new o.Pair(s,i)}delete(e){return assertCollection(this.contents)?this.contents.delete(e):false}deleteIn(e){if(i.isEmptyPath(e)){if(this.contents==null)return false;this.contents=null;return true}return assertCollection(this.contents)?this.contents.deleteIn(e):false}get(e,t){return r.isCollection(this.contents)?this.contents.get(e,t):undefined}getIn(e,t){if(i.isEmptyPath(e))return!t&&r.isScalar(this.contents)?this.contents.value:this.contents;return r.isCollection(this.contents)?this.contents.getIn(e,t):undefined}has(e){return r.isCollection(this.contents)?this.contents.has(e):false}hasIn(e){if(i.isEmptyPath(e))return this.contents!==undefined;return r.isCollection(this.contents)?this.contents.hasIn(e):false}set(e,t){if(this.contents==null){this.contents=i.collectionFromPath(this.schema,[e],t)}else if(assertCollection(this.contents)){this.contents.set(e,t)}}setIn(e,t){if(i.isEmptyPath(e))this.contents=t;else if(this.contents==null){this.contents=i.collectionFromPath(this.schema,Array.from(e),t)}else if(assertCollection(this.contents)){this.contents.setIn(e,t)}}setSchema(e,t={}){if(typeof e==="number")e=String(e);let n;switch(e){case"1.1":if(this.directives)this.directives.yaml.version="1.1";else this.directives=new p.Directives({version:"1.1"});n={merge:true,resolveKnownTags:false,schema:"yaml-1.1"};break;case"1.2":case"next":if(this.directives)this.directives.yaml.version=e;else this.directives=new p.Directives({version:e});n={merge:false,resolveKnownTags:true,schema:"core"};break;case null:if(this.directives)delete this.directives;n=null;break;default:{const t=JSON.stringify(e);throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${t}`)}}if(t.schema instanceof Object)this.schema=t.schema;else if(n)this.schema=new c.Schema(Object.assign(n,t));else throw new Error(`With a null YAML version, the { schema: Schema } option is required`)}toJS({json:e,jsonArg:t,mapAsMap:n,maxAliasCount:s,onAnchor:i,reviver:r}={}){const o={anchors:new Map,doc:this,keep:!e,mapAsMap:n===true,mapKeyWarned:false,maxAliasCount:typeof s==="number"?s:100,stringify:l.stringify};const c=a.toJS(this.contents,t??"",o);if(typeof i==="function")for(const{count:e,res:t}of o.anchors.values())i(t,e);return typeof r==="function"?d.applyReviver(r,{"":c},"",c):c}toJSON(e,t){return this.toJS({json:true,jsonArg:e,mapAsMap:false,onAnchor:t})}toString(e={}){if(this.errors.length>0)throw new Error("Document with errors cannot be stringified");if("indent"in e&&(!Number.isInteger(e.indent)||Number(e.indent)<=0)){const t=JSON.stringify(e.indent);throw new Error(`"indent" option must be a positive integer, not ${t}`)}return f.stringifyDocument(this,e)}}function assertCollection(e){if(r.isCollection(e))return true;throw new Error("Expected a YAML collection as document contents")}t.Document=Document},8459:(e,t,n)=>{var s=n(1399);var i=n(6796);function anchorIsValid(e){if(/[\x00-\x19\s,[\]{}]/.test(e)){const t=JSON.stringify(e);const n=`Anchor must not contain whitespace or control characters: ${t}`;throw new Error(n)}return true}function anchorNames(e){const t=new Set;i.visit(e,{Value(e,n){if(n.anchor)t.add(n.anchor)}});return t}function findNewAnchor(e,t){for(let n=1;true;++n){const s=`${e}${n}`;if(!t.has(s))return s}}function createNodeAnchors(e,t){const n=[];const i=new Map;let r=null;return{onAnchor:s=>{n.push(s);if(!r)r=anchorNames(e);const i=findNewAnchor(t,r);r.add(i);return i},setAnchors:()=>{for(const e of n){const t=i.get(e);if(typeof t==="object"&&t.anchor&&(s.isScalar(t.node)||s.isCollection(t.node))){t.node.anchor=t.anchor}else{const t=new Error("Failed to resolve repeated object (this should not happen)");t.source=e;throw t}}},sourceObjects:i}}t.anchorIsValid=anchorIsValid;t.anchorNames=anchorNames;t.createNodeAnchors=createNodeAnchors;t.findNewAnchor=findNewAnchor},3412:(e,t)=>{function applyReviver(e,t,n,s){if(s&&typeof s==="object"){if(Array.isArray(s)){for(let t=0,n=s.length;t<n;++t){const n=s[t];const i=applyReviver(e,s,String(t),n);if(i===undefined)delete s[t];else if(i!==n)s[t]=i}}else if(s instanceof Map){for(const t of Array.from(s.keys())){const n=s.get(t);const i=applyReviver(e,s,t,n);if(i===undefined)s.delete(t);else if(i!==n)s.set(t,i)}}else if(s instanceof Set){for(const t of Array.from(s)){const n=applyReviver(e,s,t,t);if(n===undefined)s.delete(t);else if(n!==t){s.delete(t);s.add(n)}}}else{for(const[t,n]of Object.entries(s)){const i=applyReviver(e,s,t,n);if(i===undefined)delete s[t];else if(i!==n)s[t]=i}}}return e.call(t,n,s)}t.applyReviver=applyReviver},9652:(e,t,n)=>{var s=n(5639);var i=n(1399);var r=n(9338);const o="tag:yaml.org,2002:";function findTagObject(e,t,n){if(t){const e=n.filter((e=>e.tag===t));const s=e.find((e=>!e.format))??e[0];if(!s)throw new Error(`Tag ${t} not found`);return s}return n.find((t=>t.identify?.(e)&&!t.format))}function createNode(e,t,n){if(i.isDocument(e))e=e.contents;if(i.isNode(e))return e;if(i.isPair(e)){const t=n.schema[i.MAP].createNode?.(n.schema,null,n);t.items.push(e);return t}if(e instanceof String||e instanceof Number||e instanceof Boolean||typeof BigInt!=="undefined"&&e instanceof BigInt){e=e.valueOf()}const{aliasDuplicateObjects:a,onAnchor:c,onTagObj:l,schema:f,sourceObjects:u}=n;let d=undefined;if(a&&e&&typeof e==="object"){d=u.get(e);if(d){if(!d.anchor)d.anchor=c(e);return new s.Alias(d.anchor)}else{d={anchor:null,node:null};u.set(e,d)}}if(t?.startsWith("!!"))t=o+t.slice(2);let h=findTagObject(e,t,f.tags);if(!h){if(e&&typeof e.toJSON==="function"){e=e.toJSON()}if(!e||typeof e!=="object"){const t=new r.Scalar(e);if(d)d.node=t;return t}h=e instanceof Map?f[i.MAP]:Symbol.iterator in Object(e)?f[i.SEQ]:f[i.MAP]}if(l){l(h);delete n.onTagObj}const p=h?.createNode?h.createNode(n.schema,e,n):new r.Scalar(e);if(t)p.tag=t;if(d)d.node=p;return p}t.createNode=createNode},5400:(e,t,n)=>{var s=n(1399);var i=n(6796);const r={"!":"%21",",":"%2C","[":"%5B","]":"%5D","{":"%7B","}":"%7D"};const escapeTagName=e=>e.replace(/[!,[\]{}]/g,(e=>r[e]));class Directives{constructor(e,t){this.docStart=null;this.docEnd=false;this.yaml=Object.assign({},Directives.defaultYaml,e);this.tags=Object.assign({},Directives.defaultTags,t)}clone(){const e=new Directives(this.yaml,this.tags);e.docStart=this.docStart;return e}atDocument(){const e=new Directives(this.yaml,this.tags);switch(this.yaml.version){case"1.1":this.atNextDocument=true;break;case"1.2":this.atNextDocument=false;this.yaml={explicit:Directives.defaultYaml.explicit,version:"1.2"};this.tags=Object.assign({},Directives.defaultTags);break}return e}add(e,t){if(this.atNextDocument){this.yaml={explicit:Directives.defaultYaml.explicit,version:"1.1"};this.tags=Object.assign({},Directives.defaultTags);this.atNextDocument=false}const n=e.trim().split(/[ \t]+/);const s=n.shift();switch(s){case"%TAG":{if(n.length!==2){t(0,"%TAG directive should contain exactly two parts");if(n.length<2)return false}const[e,s]=n;this.tags[e]=s;return true}case"%YAML":{this.yaml.explicit=true;if(n.length!==1){t(0,"%YAML directive should contain exactly one part");return false}const[e]=n;if(e==="1.1"||e==="1.2"){this.yaml.version=e;return true}else{const n=/^\d+\.\d+$/.test(e);t(6,`Unsupported YAML version ${e}`,n);return false}}default:t(0,`Unknown directive ${s}`,true);return false}}tagName(e,t){if(e==="!")return"!";if(e[0]!=="!"){t(`Not a valid tag: ${e}`);return null}if(e[1]==="<"){const n=e.slice(2,-1);if(n==="!"||n==="!!"){t(`Verbatim tags aren't resolved, so ${e} is invalid.`);return null}if(e[e.length-1]!==">")t("Verbatim tags must end with a >");return n}const[,n,s]=e.match(/^(.*!)([^!]*)$/);if(!s)t(`The ${e} tag has no suffix`);const i=this.tags[n];if(i)return i+decodeURIComponent(s);if(n==="!")return e;t(`Could not resolve tag: ${e}`);return null}tagString(e){for(const[t,n]of Object.entries(this.tags)){if(e.startsWith(n))return t+escapeTagName(e.substring(n.length))}return e[0]==="!"?e:`!<${e}>`}toString(e){const t=this.yaml.explicit?[`%YAML ${this.yaml.version||"1.2"}`]:[];const n=Object.entries(this.tags);let r;if(e&&n.length>0&&s.isNode(e.contents)){const t={};i.visit(e.contents,((e,n)=>{if(s.isNode(n)&&n.tag)t[n.tag]=true}));r=Object.keys(t)}else r=[];for(const[s,i]of n){if(s==="!!"&&i==="tag:yaml.org,2002:")continue;if(!e||r.some((e=>e.startsWith(i))))t.push(`%TAG ${s} ${i}`)}return t.join("\n")}}Directives.defaultYaml={explicit:false,version:"1.2"};Directives.defaultTags={"!!":"tag:yaml.org,2002:"};t.Directives=Directives},4236:(e,t)=>{class YAMLError extends Error{constructor(e,t,n,s){super();this.name=e;this.code=n;this.message=s;this.pos=t}}class YAMLParseError extends YAMLError{constructor(e,t,n){super("YAMLParseError",e,t,n)}}class YAMLWarning extends YAMLError{constructor(e,t,n){super("YAMLWarning",e,t,n)}}const prettifyError=(e,t)=>n=>{if(n.pos[0]===-1)return;n.linePos=n.pos.map((e=>t.linePos(e)));const{line:s,col:i}=n.linePos[0];n.message+=` at line ${s}, column ${i}`;let r=i-1;let o=e.substring(t.lineStarts[s-1],t.lineStarts[s]).replace(/[\n\r]+$/,"");if(r>=60&&o.length>80){const e=Math.min(r-39,o.length-79);o="…"+o.substring(e);r-=e-1}if(o.length>80)o=o.substring(0,79)+"…";if(s>1&&/^ *$/.test(o.substring(0,r))){let n=e.substring(t.lineStarts[s-2],t.lineStarts[s-1]);if(n.length>80)n=n.substring(0,79)+"…\n";o=n+o}if(/[^ ]/.test(o)){let e=1;const t=n.linePos[1];if(t&&t.line===s&&t.col>i){e=Math.min(t.col-i,80-r)}const a=" ".repeat(r)+"^".repeat(e);n.message+=`:\n\n${o}\n${a}\n`}};t.YAMLError=YAMLError;t.YAMLParseError=YAMLParseError;t.YAMLWarning=YAMLWarning;t.prettifyError=prettifyError},4083:(e,t,n)=>{var s=n(9493);var i=n(42);var r=n(6831);var o=n(4236);var a=n(5639);var c=n(1399);var l=n(246);var f=n(9338);var u=n(6011);var d=n(5161);var h=n(9169);var p=n(5976);var m=n(1929);var y=n(3328);var g=n(8649);var v=n(6796);t.Composer=s.Composer;t.Document=i.Document;t.Schema=r.Schema;t.YAMLError=o.YAMLError;t.YAMLParseError=o.YAMLParseError;t.YAMLWarning=o.YAMLWarning;t.Alias=a.Alias;t.isAlias=c.isAlias;t.isCollection=c.isCollection;t.isDocument=c.isDocument;t.isMap=c.isMap;t.isNode=c.isNode;t.isPair=c.isPair;t.isScalar=c.isScalar;t.isSeq=c.isSeq;t.Pair=l.Pair;t.Scalar=f.Scalar;t.YAMLMap=u.YAMLMap;t.YAMLSeq=d.YAMLSeq;t.CST=h;t.Lexer=p.Lexer;t.LineCounter=m.LineCounter;t.Parser=y.Parser;t.parse=g.parse;t.parseAllDocuments=g.parseAllDocuments;t.parseDocument=g.parseDocument;t.stringify=g.stringify;t.visit=v.visit;t.visitAsync=v.visitAsync},6909:(e,t)=>{function debug(e,...t){if(e==="debug")console.log(...t)}function warn(e,t){if(e==="debug"||e==="warn"){if(typeof process!=="undefined"&&process.emitWarning)process.emitWarning(t);else console.warn(t)}}t.debug=debug;t.warn=warn},5639:(e,t,n)=>{var s=n(8459);var i=n(6796);var r=n(1399);class Alias extends r.NodeBase{constructor(e){super(r.ALIAS);this.source=e;Object.defineProperty(this,"tag",{set(){throw new Error("Alias nodes cannot have tags")}})}resolve(e){let t=undefined;i.visit(e,{Node:(e,n)=>{if(n===this)return i.visit.BREAK;if(n.anchor===this.source)t=n}});return t}toJSON(e,t){if(!t)return{source:this.source};const{anchors:n,doc:s,maxAliasCount:i}=t;const r=this.resolve(s);if(!r){const e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw new ReferenceError(e)}const o=n.get(r);if(!o||o.res===undefined){const e="This should not happen: Alias anchor was not resolved?";throw new ReferenceError(e)}if(i>=0){o.count+=1;if(o.aliasCount===0)o.aliasCount=getAliasCount(s,r,n);if(o.count*o.aliasCount>i){const e="Excessive alias count indicates a resource exhaustion attack";throw new ReferenceError(e)}}return o.res}toString(e,t,n){const i=`*${this.source}`;if(e){s.anchorIsValid(this.source);if(e.options.verifyAliasOrder&&!e.anchors.has(this.source)){const e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw new Error(e)}if(e.implicitKey)return`${i} `}return i}}function getAliasCount(e,t,n){if(r.isAlias(t)){const s=t.resolve(e);const i=n&&s&&n.get(s);return i?i.count*i.aliasCount:0}else if(r.isCollection(t)){let s=0;for(const i of t.items){const t=getAliasCount(e,i,n);if(t>s)s=t}return s}else if(r.isPair(t)){const s=getAliasCount(e,t.key,n);const i=getAliasCount(e,t.value,n);return Math.max(s,i)}return 1}t.Alias=Alias},3466:(e,t,n)=>{var s=n(9652);var i=n(1399);function collectionFromPath(e,t,n){let i=n;for(let e=t.length-1;e>=0;--e){const n=t[e];if(typeof n==="number"&&Number.isInteger(n)&&n>=0){const e=[];e[n]=i;i=e}else{i=new Map([[n,i]])}}return s.createNode(i,undefined,{aliasDuplicateObjects:false,keepUndefined:false,onAnchor:()=>{throw new Error("This should not happen, please report a bug.")},schema:e,sourceObjects:new Map})}const isEmptyPath=e=>e==null||typeof e==="object"&&!!e[Symbol.iterator]().next().done;class Collection extends i.NodeBase{constructor(e,t){super(e);Object.defineProperty(this,"schema",{value:t,configurable:true,enumerable:false,writable:true})}clone(e){const t=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));if(e)t.schema=e;t.items=t.items.map((t=>i.isNode(t)||i.isPair(t)?t.clone(e):t));if(this.range)t.range=this.range.slice();return t}addIn(e,t){if(isEmptyPath(e))this.add(t);else{const[n,...s]=e;const r=this.get(n,true);if(i.isCollection(r))r.addIn(s,t);else if(r===undefined&&this.schema)this.set(n,collectionFromPath(this.schema,s,t));else throw new Error(`Expected YAML collection at ${n}. Remaining path: ${s}`)}}deleteIn(e){const[t,...n]=e;if(n.length===0)return this.delete(t);const s=this.get(t,true);if(i.isCollection(s))return s.deleteIn(n);else throw new Error(`Expected YAML collection at ${t}. Remaining path: ${n}`)}getIn(e,t){const[n,...s]=e;const r=this.get(n,true);if(s.length===0)return!t&&i.isScalar(r)?r.value:r;else return i.isCollection(r)?r.getIn(s,t):undefined}hasAllNullValues(e){return this.items.every((t=>{if(!i.isPair(t))return false;const n=t.value;return n==null||e&&i.isScalar(n)&&n.value==null&&!n.commentBefore&&!n.comment&&!n.tag}))}hasIn(e){const[t,...n]=e;if(n.length===0)return this.has(t);const s=this.get(t,true);return i.isCollection(s)?s.hasIn(n):false}setIn(e,t){const[n,...s]=e;if(s.length===0){this.set(n,t)}else{const e=this.get(n,true);if(i.isCollection(e))e.setIn(s,t);else if(e===undefined&&this.schema)this.set(n,collectionFromPath(this.schema,s,t));else throw new Error(`Expected YAML collection at ${n}. Remaining path: ${s}`)}}}Collection.maxFlowStringSingleLineLength=60;t.Collection=Collection;t.collectionFromPath=collectionFromPath;t.isEmptyPath=isEmptyPath},1399:(e,t)=>{const n=Symbol.for("yaml.alias");const s=Symbol.for("yaml.document");const i=Symbol.for("yaml.map");const r=Symbol.for("yaml.pair");const o=Symbol.for("yaml.scalar");const a=Symbol.for("yaml.seq");const c=Symbol.for("yaml.node.type");const isAlias=e=>!!e&&typeof e==="object"&&e[c]===n;const isDocument=e=>!!e&&typeof e==="object"&&e[c]===s;const isMap=e=>!!e&&typeof e==="object"&&e[c]===i;const isPair=e=>!!e&&typeof e==="object"&&e[c]===r;const isScalar=e=>!!e&&typeof e==="object"&&e[c]===o;const isSeq=e=>!!e&&typeof e==="object"&&e[c]===a;function isCollection(e){if(e&&typeof e==="object")switch(e[c]){case i:case a:return true}return false}function isNode(e){if(e&&typeof e==="object")switch(e[c]){case n:case i:case o:case a:return true}return false}const hasAnchor=e=>(isScalar(e)||isCollection(e))&&!!e.anchor;class NodeBase{constructor(e){Object.defineProperty(this,c,{value:e})}clone(){const e=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));if(this.range)e.range=this.range.slice();return e}}t.ALIAS=n;t.DOC=s;t.MAP=i;t.NODE_TYPE=c;t.NodeBase=NodeBase;t.PAIR=r;t.SCALAR=o;t.SEQ=a;t.hasAnchor=hasAnchor;t.isAlias=isAlias;t.isCollection=isCollection;t.isDocument=isDocument;t.isMap=isMap;t.isNode=isNode;t.isPair=isPair;t.isScalar=isScalar;t.isSeq=isSeq},246:(e,t,n)=>{var s=n(9652);var i=n(4875);var r=n(4676);var o=n(1399);function createPair(e,t,n){const i=s.createNode(e,undefined,n);const r=s.createNode(t,undefined,n);return new Pair(i,r)}class Pair{constructor(e,t=null){Object.defineProperty(this,o.NODE_TYPE,{value:o.PAIR});this.key=e;this.value=t}clone(e){let{key:t,value:n}=this;if(o.isNode(t))t=t.clone(e);if(o.isNode(n))n=n.clone(e);return new Pair(t,n)}toJSON(e,t){const n=t?.mapAsMap?new Map:{};return r.addPairToJSMap(t,n,this)}toString(e,t,n){return e?.doc?i.stringifyPair(this,e,t,n):JSON.stringify(this)}}t.Pair=Pair;t.createPair=createPair},9338:(e,t,n)=>{var s=n(1399);var i=n(2463);const isScalarValue=e=>!e||typeof e!=="function"&&typeof e!=="object";class Scalar extends s.NodeBase{constructor(e){super(s.SCALAR);this.value=e}toJSON(e,t){return t?.keep?this.value:i.toJS(this.value,e,t)}toString(){return String(this.value)}}Scalar.BLOCK_FOLDED="BLOCK_FOLDED";Scalar.BLOCK_LITERAL="BLOCK_LITERAL";Scalar.PLAIN="PLAIN";Scalar.QUOTE_DOUBLE="QUOTE_DOUBLE";Scalar.QUOTE_SINGLE="QUOTE_SINGLE";t.Scalar=Scalar;t.isScalarValue=isScalarValue},6011:(e,t,n)=>{var s=n(2466);var i=n(4676);var r=n(3466);var o=n(1399);var a=n(246);var c=n(9338);function findPair(e,t){const n=o.isScalar(t)?t.value:t;for(const s of e){if(o.isPair(s)){if(s.key===t||s.key===n)return s;if(o.isScalar(s.key)&&s.key.value===n)return s}}return undefined}class YAMLMap extends r.Collection{constructor(e){super(o.MAP,e);this.items=[]}static get tagName(){return"tag:yaml.org,2002:map"}add(e,t){let n;if(o.isPair(e))n=e;else if(!e||typeof e!=="object"||!("key"in e)){n=new a.Pair(e,e?.value)}else n=new a.Pair(e.key,e.value);const s=findPair(this.items,n.key);const i=this.schema?.sortMapEntries;if(s){if(!t)throw new Error(`Key ${n.key} already set`);if(o.isScalar(s.value)&&c.isScalarValue(n.value))s.value.value=n.value;else s.value=n.value}else if(i){const e=this.items.findIndex((e=>i(n,e)<0));if(e===-1)this.items.push(n);else this.items.splice(e,0,n)}else{this.items.push(n)}}delete(e){const t=findPair(this.items,e);if(!t)return false;const n=this.items.splice(this.items.indexOf(t),1);return n.length>0}get(e,t){const n=findPair(this.items,e);const s=n?.value;return(!t&&o.isScalar(s)?s.value:s)??undefined}has(e){return!!findPair(this.items,e)}set(e,t){this.add(new a.Pair(e,t),true)}toJSON(e,t,n){const s=n?new n:t?.mapAsMap?new Map:{};if(t?.onCreate)t.onCreate(s);for(const e of this.items)i.addPairToJSMap(t,s,e);return s}toString(e,t,n){if(!e)return JSON.stringify(this);for(const e of this.items){if(!o.isPair(e))throw new Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`)}if(!e.allNullValues&&this.hasAllNullValues(false))e=Object.assign({},e,{allNullValues:true});return s.stringifyCollection(this,e,{blockItemPrefix:"",flowChars:{start:"{",end:"}"},itemIndent:e.indent||"",onChompKeep:n,onComment:t})}}t.YAMLMap=YAMLMap;t.findPair=findPair},5161:(e,t,n)=>{var s=n(2466);var i=n(3466);var r=n(1399);var o=n(9338);var a=n(2463);class YAMLSeq extends i.Collection{constructor(e){super(r.SEQ,e);this.items=[]}static get tagName(){return"tag:yaml.org,2002:seq"}add(e){this.items.push(e)}delete(e){const t=asItemIndex(e);if(typeof t!=="number")return false;const n=this.items.splice(t,1);return n.length>0}get(e,t){const n=asItemIndex(e);if(typeof n!=="number")return undefined;const s=this.items[n];return!t&&r.isScalar(s)?s.value:s}has(e){const t=asItemIndex(e);return typeof t==="number"&&t<this.items.length}set(e,t){const n=asItemIndex(e);if(typeof n!=="number")throw new Error(`Expected a valid index, not ${e}.`);const s=this.items[n];if(r.isScalar(s)&&o.isScalarValue(t))s.value=t;else this.items[n]=t}toJSON(e,t){const n=[];if(t?.onCreate)t.onCreate(n);let s=0;for(const e of this.items)n.push(a.toJS(e,String(s++),t));return n}toString(e,t,n){if(!e)return JSON.stringify(this);return s.stringifyCollection(this,e,{blockItemPrefix:"- ",flowChars:{start:"[",end:"]"},itemIndent:(e.indent||"")+"  ",onChompKeep:n,onComment:t})}}function asItemIndex(e){let t=r.isScalar(e)?e.value:e;if(t&&typeof t==="string")t=Number(t);return typeof t==="number"&&Number.isInteger(t)&&t>=0?t:null}t.YAMLSeq=YAMLSeq},4676:(e,t,n)=>{var s=n(6909);var i=n(8409);var r=n(1399);var o=n(9338);var a=n(2463);const c="<<";function addPairToJSMap(e,t,{key:n,value:s}){if(e?.doc.schema.merge&&isMergeKey(n)){s=r.isAlias(s)?s.resolve(e.doc):s;if(r.isSeq(s))for(const n of s.items)mergeToJSMap(e,t,n);else if(Array.isArray(s))for(const n of s)mergeToJSMap(e,t,n);else mergeToJSMap(e,t,s)}else{const i=a.toJS(n,"",e);if(t instanceof Map){t.set(i,a.toJS(s,i,e))}else if(t instanceof Set){t.add(i)}else{const r=stringifyKey(n,i,e);const o=a.toJS(s,r,e);if(r in t)Object.defineProperty(t,r,{value:o,writable:true,enumerable:true,configurable:true});else t[r]=o}}return t}const isMergeKey=e=>e===c||r.isScalar(e)&&e.value===c&&(!e.type||e.type===o.Scalar.PLAIN);function mergeToJSMap(e,t,n){const s=e&&r.isAlias(n)?n.resolve(e.doc):n;if(!r.isMap(s))throw new Error("Merge sources must be maps or map aliases");const i=s.toJSON(null,e,Map);for(const[e,n]of i){if(t instanceof Map){if(!t.has(e))t.set(e,n)}else if(t instanceof Set){t.add(e)}else if(!Object.prototype.hasOwnProperty.call(t,e)){Object.defineProperty(t,e,{value:n,writable:true,enumerable:true,configurable:true})}}return t}function stringifyKey(e,t,n){if(t===null)return"";if(typeof t!=="object")return String(t);if(r.isNode(e)&&n&&n.doc){const t=i.createStringifyContext(n.doc,{});t.anchors=new Set;for(const e of n.anchors.keys())t.anchors.add(e.anchor);t.inFlow=true;t.inStringifyKey=true;const r=e.toString(t);if(!n.mapKeyWarned){let e=JSON.stringify(r);if(e.length>40)e=e.substring(0,36)+'..."';s.warn(n.doc.options.logLevel,`Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`);n.mapKeyWarned=true}return r}return JSON.stringify(t)}t.addPairToJSMap=addPairToJSMap},2463:(e,t,n)=>{var s=n(1399);function toJS(e,t,n){if(Array.isArray(e))return e.map(((e,t)=>toJS(e,String(t),n)));if(e&&typeof e.toJSON==="function"){if(!n||!s.hasAnchor(e))return e.toJSON(t,n);const i={aliasCount:0,count:1,res:undefined};n.anchors.set(e,i);n.onCreate=e=>{i.res=e;delete n.onCreate};const r=e.toJSON(t,n);if(n.onCreate)n.onCreate(r);return r}if(typeof e==="bigint"&&!n?.keep)return Number(e);return e}t.toJS=toJS},9027:(e,t,n)=>{var s=n(9485);var i=n(7578);var r=n(4236);var o=n(6226);function resolveAsScalar(e,t=true,n){if(e){const _onError=(e,t,s)=>{const i=typeof e==="number"?e:Array.isArray(e)?e[0]:e.offset;if(n)n(i,t,s);else throw new r.YAMLParseError([i,i+1],t,s)};switch(e.type){case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return i.resolveFlowScalar(e,t,_onError);case"block-scalar":return s.resolveBlockScalar(e,t,_onError)}}return null}function createScalarToken(e,t){const{implicitKey:n=false,indent:s,inFlow:i=false,offset:r=-1,type:a="PLAIN"}=t;const c=o.stringifyString({type:a,value:e},{implicitKey:n,indent:s>0?" ".repeat(s):"",inFlow:i,options:{blockQuote:true,lineWidth:-1}});const l=t.end??[{type:"newline",offset:-1,indent:s,source:"\n"}];switch(c[0]){case"|":case">":{const e=c.indexOf("\n");const t=c.substring(0,e);const n=c.substring(e+1)+"\n";const i=[{type:"block-scalar-header",offset:r,indent:s,source:t}];if(!addEndtoBlockProps(i,l))i.push({type:"newline",offset:-1,indent:s,source:"\n"});return{type:"block-scalar",offset:r,indent:s,props:i,source:n}}case'"':return{type:"double-quoted-scalar",offset:r,indent:s,source:c,end:l};case"'":return{type:"single-quoted-scalar",offset:r,indent:s,source:c,end:l};default:return{type:"scalar",offset:r,indent:s,source:c,end:l}}}function setScalarValue(e,t,n={}){let{afterKey:s=false,implicitKey:i=false,inFlow:r=false,type:a}=n;let c="indent"in e?e.indent:null;if(s&&typeof c==="number")c+=2;if(!a)switch(e.type){case"single-quoted-scalar":a="QUOTE_SINGLE";break;case"double-quoted-scalar":a="QUOTE_DOUBLE";break;case"block-scalar":{const t=e.props[0];if(t.type!=="block-scalar-header")throw new Error("Invalid block scalar header");a=t.source[0]===">"?"BLOCK_FOLDED":"BLOCK_LITERAL";break}default:a="PLAIN"}const l=o.stringifyString({type:a,value:t},{implicitKey:i||c===null,indent:c!==null&&c>0?" ".repeat(c):"",inFlow:r,options:{blockQuote:true,lineWidth:-1}});switch(l[0]){case"|":case">":setBlockScalarValue(e,l);break;case'"':setFlowScalarValue(e,l,"double-quoted-scalar");break;case"'":setFlowScalarValue(e,l,"single-quoted-scalar");break;default:setFlowScalarValue(e,l,"scalar")}}function setBlockScalarValue(e,t){const n=t.indexOf("\n");const s=t.substring(0,n);const i=t.substring(n+1)+"\n";if(e.type==="block-scalar"){const t=e.props[0];if(t.type!=="block-scalar-header")throw new Error("Invalid block scalar header");t.source=s;e.source=i}else{const{offset:t}=e;const n="indent"in e?e.indent:-1;const r=[{type:"block-scalar-header",offset:t,indent:n,source:s}];if(!addEndtoBlockProps(r,"end"in e?e.end:undefined))r.push({type:"newline",offset:-1,indent:n,source:"\n"});for(const t of Object.keys(e))if(t!=="type"&&t!=="offset")delete e[t];Object.assign(e,{type:"block-scalar",indent:n,props:r,source:i})}}function addEndtoBlockProps(e,t){if(t)for(const n of t)switch(n.type){case"space":case"comment":e.push(n);break;case"newline":e.push(n);return true}return false}function setFlowScalarValue(e,t,n){switch(e.type){case"scalar":case"double-quoted-scalar":case"single-quoted-scalar":e.type=n;e.source=t;break;case"block-scalar":{const s=e.props.slice(1);let i=t.length;if(e.props[0].type==="block-scalar-header")i-=e.props[0].source.length;for(const e of s)e.offset+=i;delete e.props;Object.assign(e,{type:n,source:t,end:s});break}case"block-map":case"block-seq":{const s=e.offset+t.length;const i={type:"newline",offset:s,indent:e.indent,source:"\n"};delete e.items;Object.assign(e,{type:n,source:t,end:[i]});break}default:{const s="indent"in e?e.indent:-1;const i="end"in e&&Array.isArray(e.end)?e.end.filter((e=>e.type==="space"||e.type==="comment"||e.type==="newline")):[];for(const t of Object.keys(e))if(t!=="type"&&t!=="offset")delete e[t];Object.assign(e,{type:n,indent:s,source:t,end:i})}}}t.createScalarToken=createScalarToken;t.resolveAsScalar=resolveAsScalar;t.setScalarValue=setScalarValue},6307:(e,t)=>{const stringify=e=>"type"in e?stringifyToken(e):stringifyItem(e);function stringifyToken(e){switch(e.type){case"block-scalar":{let t="";for(const n of e.props)t+=stringifyToken(n);return t+e.source}case"block-map":case"block-seq":{let t="";for(const n of e.items)t+=stringifyItem(n);return t}case"flow-collection":{let t=e.start.source;for(const n of e.items)t+=stringifyItem(n);for(const n of e.end)t+=n.source;return t}case"document":{let t=stringifyItem(e);if(e.end)for(const n of e.end)t+=n.source;return t}default:{let t=e.source;if("end"in e&&e.end)for(const n of e.end)t+=n.source;return t}}}function stringifyItem({start:e,key:t,sep:n,value:s}){let i="";for(const t of e)i+=t.source;if(t)i+=stringifyToken(t);if(n)for(const e of n)i+=e.source;if(s)i+=stringifyToken(s);return i}t.stringify=stringify},8497:(e,t)=>{const n=Symbol("break visit");const s=Symbol("skip children");const i=Symbol("remove item");function visit(e,t){if("type"in e&&e.type==="document")e={start:e.start,value:e.value};_visit(Object.freeze([]),e,t)}visit.BREAK=n;visit.SKIP=s;visit.REMOVE=i;visit.itemAtPath=(e,t)=>{let n=e;for(const[e,s]of t){const t=n?.[e];if(t&&"items"in t){n=t.items[s]}else return undefined}return n};visit.parentCollection=(e,t)=>{const n=visit.itemAtPath(e,t.slice(0,-1));const s=t[t.length-1][0];const i=n?.[s];if(i&&"items"in i)return i;throw new Error("Parent collection not found")};function _visit(e,t,s){let r=s(t,e);if(typeof r==="symbol")return r;for(const o of["key","value"]){const a=t[o];if(a&&"items"in a){for(let t=0;t<a.items.length;++t){const r=_visit(Object.freeze(e.concat([[o,t]])),a.items[t],s);if(typeof r==="number")t=r-1;else if(r===n)return n;else if(r===i){a.items.splice(t,1);t-=1}}if(typeof r==="function"&&o==="key")r=r(t,e)}}return typeof r==="function"?r(t,e):r}t.visit=visit},9169:(e,t,n)=>{var s=n(9027);var i=n(6307);var r=n(8497);const o="\ufeff";const a="";const c="";const l="";const isCollection=e=>!!e&&"items"in e;const isScalar=e=>!!e&&(e.type==="scalar"||e.type==="single-quoted-scalar"||e.type==="double-quoted-scalar"||e.type==="block-scalar");function prettyToken(e){switch(e){case o:return"<BOM>";case a:return"<DOC>";case c:return"<FLOW_END>";case l:return"<SCALAR>";default:return JSON.stringify(e)}}function tokenType(e){switch(e){case o:return"byte-order-mark";case a:return"doc-mode";case c:return"flow-error-end";case l:return"scalar";case"---":return"doc-start";case"...":return"doc-end";case"":case"\n":case"\r\n":return"newline";case"-":return"seq-item-ind";case"?":return"explicit-key-ind";case":":return"map-value-ind";case"{":return"flow-map-start";case"}":return"flow-map-end";case"[":return"flow-seq-start";case"]":return"flow-seq-end";case",":return"comma"}switch(e[0]){case" ":case"\t":return"space";case"#":return"comment";case"%":return"directive-line";case"*":return"alias";case"&":return"anchor";case"!":return"tag";case"'":return"single-quoted-scalar";case'"':return"double-quoted-scalar";case"|":case">":return"block-scalar-header"}return null}t.createScalarToken=s.createScalarToken;t.resolveAsScalar=s.resolveAsScalar;t.setScalarValue=s.setScalarValue;t.stringify=i.stringify;t.visit=r.visit;t.BOM=o;t.DOCUMENT=a;t.FLOW_END=c;t.SCALAR=l;t.isCollection=isCollection;t.isScalar=isScalar;t.prettyToken=prettyToken;t.tokenType=tokenType},5976:(e,t,n)=>{var s=n(9169);function isEmpty(e){switch(e){case undefined:case" ":case"\n":case"\r":case"\t":return true;default:return false}}const i="0123456789ABCDEFabcdef".split("");const r="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()".split("");const o=",[]{}".split("");const a=" ,[]{}\n\r\t".split("");const isNotAnchorChar=e=>!e||a.includes(e);class Lexer{constructor(){this.atEnd=false;this.blockScalarIndent=-1;this.blockScalarKeep=false;this.buffer="";this.flowKey=false;this.flowLevel=0;this.indentNext=0;this.indentValue=0;this.lineEndPos=null;this.next=null;this.pos=0}*lex(e,t=false){if(e){this.buffer=this.buffer?this.buffer+e:e;this.lineEndPos=null}this.atEnd=!t;let n=this.next??"stream";while(n&&(t||this.hasChars(1)))n=yield*this.parseNext(n)}atLineEnd(){let e=this.pos;let t=this.buffer[e];while(t===" "||t==="\t")t=this.buffer[++e];if(!t||t==="#"||t==="\n")return true;if(t==="\r")return this.buffer[e+1]==="\n";return false}charAt(e){return this.buffer[this.pos+e]}continueScalar(e){let t=this.buffer[e];if(this.indentNext>0){let n=0;while(t===" ")t=this.buffer[++n+e];if(t==="\r"){const t=this.buffer[n+e+1];if(t==="\n"||!t&&!this.atEnd)return e+n+1}return t==="\n"||n>=this.indentNext||!t&&!this.atEnd?e+n:-1}if(t==="-"||t==="."){const t=this.buffer.substr(e,3);if((t==="---"||t==="...")&&isEmpty(this.buffer[e+3]))return-1}return e}getLine(){let e=this.lineEndPos;if(typeof e!=="number"||e!==-1&&e<this.pos){e=this.buffer.indexOf("\n",this.pos);this.lineEndPos=e}if(e===-1)return this.atEnd?this.buffer.substring(this.pos):null;if(this.buffer[e-1]==="\r")e-=1;return this.buffer.substring(this.pos,e)}hasChars(e){return this.pos+e<=this.buffer.length}setNext(e){this.buffer=this.buffer.substring(this.pos);this.pos=0;this.lineEndPos=null;this.next=e;return null}peek(e){return this.buffer.substr(this.pos,e)}*parseNext(e){switch(e){case"stream":return yield*this.parseStream();case"line-start":return yield*this.parseLineStart();case"block-start":return yield*this.parseBlockStart();case"doc":return yield*this.parseDocument();case"flow":return yield*this.parseFlowCollection();case"quoted-scalar":return yield*this.parseQuotedScalar();case"block-scalar":return yield*this.parseBlockScalar();case"plain-scalar":return yield*this.parsePlainScalar()}}*parseStream(){let e=this.getLine();if(e===null)return this.setNext("stream");if(e[0]===s.BOM){yield*this.pushCount(1);e=e.substring(1)}if(e[0]==="%"){let t=e.length;const n=e.indexOf("#");if(n!==-1){const s=e[n-1];if(s===" "||s==="\t")t=n-1}while(true){const n=e[t-1];if(n===" "||n==="\t")t-=1;else break}const s=(yield*this.pushCount(t))+(yield*this.pushSpaces(true));yield*this.pushCount(e.length-s);this.pushNewline();return"stream"}if(this.atLineEnd()){const t=yield*this.pushSpaces(true);yield*this.pushCount(e.length-t);yield*this.pushNewline();return"stream"}yield s.DOCUMENT;return yield*this.parseLineStart()}*parseLineStart(){const e=this.charAt(0);if(!e&&!this.atEnd)return this.setNext("line-start");if(e==="-"||e==="."){if(!this.atEnd&&!this.hasChars(4))return this.setNext("line-start");const e=this.peek(3);if(e==="---"&&isEmpty(this.charAt(3))){yield*this.pushCount(3);this.indentValue=0;this.indentNext=0;return"doc"}else if(e==="..."&&isEmpty(this.charAt(3))){yield*this.pushCount(3);return"stream"}}this.indentValue=yield*this.pushSpaces(false);if(this.indentNext>this.indentValue&&!isEmpty(this.charAt(1)))this.indentNext=this.indentValue;return yield*this.parseBlockStart()}*parseBlockStart(){const[e,t]=this.peek(2);if(!t&&!this.atEnd)return this.setNext("block-start");if((e==="-"||e==="?"||e===":")&&isEmpty(t)){const e=(yield*this.pushCount(1))+(yield*this.pushSpaces(true));this.indentNext=this.indentValue+1;this.indentValue+=e;return yield*this.parseBlockStart()}return"doc"}*parseDocument(){yield*this.pushSpaces(true);const e=this.getLine();if(e===null)return this.setNext("doc");let t=yield*this.pushIndicators();switch(e[t]){case"#":yield*this.pushCount(e.length-t);case undefined:yield*this.pushNewline();return yield*this.parseLineStart();case"{":case"[":yield*this.pushCount(1);this.flowKey=false;this.flowLevel=1;return"flow";case"}":case"]":yield*this.pushCount(1);return"doc";case"*":yield*this.pushUntil(isNotAnchorChar);return"doc";case'"':case"'":return yield*this.parseQuotedScalar();case"|":case">":t+=(yield*this.parseBlockScalarHeader());t+=(yield*this.pushSpaces(true));yield*this.pushCount(e.length-t);yield*this.pushNewline();return yield*this.parseBlockScalar();default:return yield*this.parsePlainScalar()}}*parseFlowCollection(){let e,t;let n=-1;do{e=yield*this.pushNewline();if(e>0){t=yield*this.pushSpaces(false);this.indentValue=n=t}else{t=0}t+=(yield*this.pushSpaces(true))}while(e+t>0);const i=this.getLine();if(i===null)return this.setNext("flow");if(n!==-1&&n<this.indentNext&&i[0]!=="#"||n===0&&(i.startsWith("---")||i.startsWith("..."))&&isEmpty(i[3])){const e=n===this.indentNext-1&&this.flowLevel===1&&(i[0]==="]"||i[0]==="}");if(!e){this.flowLevel=0;yield s.FLOW_END;return yield*this.parseLineStart()}}let r=0;while(i[r]===","){r+=(yield*this.pushCount(1));r+=(yield*this.pushSpaces(true));this.flowKey=false}r+=(yield*this.pushIndicators());switch(i[r]){case undefined:return"flow";case"#":yield*this.pushCount(i.length-r);return"flow";case"{":case"[":yield*this.pushCount(1);this.flowKey=false;this.flowLevel+=1;return"flow";case"}":case"]":yield*this.pushCount(1);this.flowKey=true;this.flowLevel-=1;return this.flowLevel?"flow":"doc";case"*":yield*this.pushUntil(isNotAnchorChar);return"flow";case'"':case"'":this.flowKey=true;return yield*this.parseQuotedScalar();case":":{const e=this.charAt(1);if(this.flowKey||isEmpty(e)||e===","){this.flowKey=false;yield*this.pushCount(1);yield*this.pushSpaces(true);return"flow"}}default:this.flowKey=false;return yield*this.parsePlainScalar()}}*parseQuotedScalar(){const e=this.charAt(0);let t=this.buffer.indexOf(e,this.pos+1);if(e==="'"){while(t!==-1&&this.buffer[t+1]==="'")t=this.buffer.indexOf("'",t+2)}else{while(t!==-1){let e=0;while(this.buffer[t-1-e]==="\\")e+=1;if(e%2===0)break;t=this.buffer.indexOf('"',t+1)}}const n=this.buffer.substring(0,t);let s=n.indexOf("\n",this.pos);if(s!==-1){while(s!==-1){const e=this.continueScalar(s+1);if(e===-1)break;s=n.indexOf("\n",e)}if(s!==-1){t=s-(n[s-1]==="\r"?2:1)}}if(t===-1){if(!this.atEnd)return this.setNext("quoted-scalar");t=this.buffer.length}yield*this.pushToIndex(t+1,false);return this.flowLevel?"flow":"doc"}*parseBlockScalarHeader(){this.blockScalarIndent=-1;this.blockScalarKeep=false;let e=this.pos;while(true){const t=this.buffer[++e];if(t==="+")this.blockScalarKeep=true;else if(t>"0"&&t<="9")this.blockScalarIndent=Number(t)-1;else if(t!=="-")break}return yield*this.pushUntil((e=>isEmpty(e)||e==="#"))}*parseBlockScalar(){let e=this.pos-1;let t=0;let n;e:for(let s=this.pos;n=this.buffer[s];++s){switch(n){case" ":t+=1;break;case"\n":e=s;t=0;break;case"\r":{const e=this.buffer[s+1];if(!e&&!this.atEnd)return this.setNext("block-scalar");if(e==="\n")break}default:break e}}if(!n&&!this.atEnd)return this.setNext("block-scalar");if(t>=this.indentNext){if(this.blockScalarIndent===-1)this.indentNext=t;else this.indentNext+=this.blockScalarIndent;do{const t=this.continueScalar(e+1);if(t===-1)break;e=this.buffer.indexOf("\n",t)}while(e!==-1);if(e===-1){if(!this.atEnd)return this.setNext("block-scalar");e=this.buffer.length}}if(!this.blockScalarKeep){do{let n=e-1;let s=this.buffer[n];if(s==="\r")s=this.buffer[--n];const i=n;while(s===" "||s==="\t")s=this.buffer[--n];if(s==="\n"&&n>=this.pos&&n+1+t>i)e=n;else break}while(true)}yield s.SCALAR;yield*this.pushToIndex(e+1,true);return yield*this.parseLineStart()}*parsePlainScalar(){const e=this.flowLevel>0;let t=this.pos-1;let n=this.pos-1;let i;while(i=this.buffer[++n]){if(i===":"){const s=this.buffer[n+1];if(isEmpty(s)||e&&s===",")break;t=n}else if(isEmpty(i)){let s=this.buffer[n+1];if(i==="\r"){if(s==="\n"){n+=1;i="\n";s=this.buffer[n+1]}else t=n}if(s==="#"||e&&o.includes(s))break;if(i==="\n"){const e=this.continueScalar(n+1);if(e===-1)break;n=Math.max(n,e-2)}}else{if(e&&o.includes(i))break;t=n}}if(!i&&!this.atEnd)return this.setNext("plain-scalar");yield s.SCALAR;yield*this.pushToIndex(t+1,true);return e?"flow":"doc"}*pushCount(e){if(e>0){yield this.buffer.substr(this.pos,e);this.pos+=e;return e}return 0}*pushToIndex(e,t){const n=this.buffer.slice(this.pos,e);if(n){yield n;this.pos+=n.length;return n.length}else if(t)yield"";return 0}*pushIndicators(){switch(this.charAt(0)){case"!":return(yield*this.pushTag())+(yield*this.pushSpaces(true))+(yield*this.pushIndicators());case"&":return(yield*this.pushUntil(isNotAnchorChar))+(yield*this.pushSpaces(true))+(yield*this.pushIndicators());case"-":case"?":case":":{const e=this.flowLevel>0;const t=this.charAt(1);if(isEmpty(t)||e&&o.includes(t)){if(!e)this.indentNext=this.indentValue+1;else if(this.flowKey)this.flowKey=false;return(yield*this.pushCount(1))+(yield*this.pushSpaces(true))+(yield*this.pushIndicators())}}}return 0}*pushTag(){if(this.charAt(1)==="<"){let e=this.pos+2;let t=this.buffer[e];while(!isEmpty(t)&&t!==">")t=this.buffer[++e];return yield*this.pushToIndex(t===">"?e+1:e,false)}else{let e=this.pos+1;let t=this.buffer[e];while(t){if(r.includes(t))t=this.buffer[++e];else if(t==="%"&&i.includes(this.buffer[e+1])&&i.includes(this.buffer[e+2])){t=this.buffer[e+=3]}else break}return yield*this.pushToIndex(e,false)}}*pushNewline(){const e=this.buffer[this.pos];if(e==="\n")return yield*this.pushCount(1);else if(e==="\r"&&this.charAt(1)==="\n")return yield*this.pushCount(2);else return 0}*pushSpaces(e){let t=this.pos-1;let n;do{n=this.buffer[++t]}while(n===" "||e&&n==="\t");const s=t-this.pos;if(s>0){yield this.buffer.substr(this.pos,s);this.pos=t}return s}*pushUntil(e){let t=this.pos;let n=this.buffer[t];while(!e(n))n=this.buffer[++t];return yield*this.pushToIndex(t,false)}}t.Lexer=Lexer},1929:(e,t)=>{class LineCounter{constructor(){this.lineStarts=[];this.addNewLine=e=>this.lineStarts.push(e);this.linePos=e=>{let t=0;let n=this.lineStarts.length;while(t<n){const s=t+n>>1;if(this.lineStarts[s]<e)t=s+1;else n=s}if(this.lineStarts[t]===e)return{line:t+1,col:1};if(t===0)return{line:0,col:e};const s=this.lineStarts[t-1];return{line:t,col:e-s+1}}}}t.LineCounter=LineCounter},3328:(e,t,n)=>{var s=n(9169);var i=n(5976);function includesToken(e,t){for(let n=0;n<e.length;++n)if(e[n].type===t)return true;return false}function findNonEmptyIndex(e){for(let t=0;t<e.length;++t){switch(e[t].type){case"space":case"comment":case"newline":break;default:return t}}return-1}function isFlowToken(e){switch(e?.type){case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":case"flow-collection":return true;default:return false}}function getPrevProps(e){switch(e.type){case"document":return e.start;case"block-map":{const t=e.items[e.items.length-1];return t.sep??t.start}case"block-seq":return e.items[e.items.length-1].start;default:return[]}}function getFirstKeyStartProps(e){if(e.length===0)return[];let t=e.length;e:while(--t>=0){switch(e[t].type){case"doc-start":case"explicit-key-ind":case"map-value-ind":case"seq-item-ind":case"newline":break e}}while(e[++t]?.type==="space"){}return e.splice(t,e.length)}function fixFlowSeqItems(e){if(e.start.type==="flow-seq-start"){for(const t of e.items){if(t.sep&&!t.value&&!includesToken(t.start,"explicit-key-ind")&&!includesToken(t.sep,"map-value-ind")){if(t.key)t.value=t.key;delete t.key;if(isFlowToken(t.value)){if(t.value.end)Array.prototype.push.apply(t.value.end,t.sep);else t.value.end=t.sep}else Array.prototype.push.apply(t.start,t.sep);delete t.sep}}}}class Parser{constructor(e){this.atNewLine=true;this.atScalar=false;this.indent=0;this.offset=0;this.onKeyLine=false;this.stack=[];this.source="";this.type="";this.lexer=new i.Lexer;this.onNewLine=e}*parse(e,t=false){if(this.onNewLine&&this.offset===0)this.onNewLine(0);for(const n of this.lexer.lex(e,t))yield*this.next(n);if(!t)yield*this.end()}*next(e){this.source=e;if(process.env.LOG_TOKENS)console.log("|",s.prettyToken(e));if(this.atScalar){this.atScalar=false;yield*this.step();this.offset+=e.length;return}const t=s.tokenType(e);if(!t){const t=`Not a YAML token: ${e}`;yield*this.pop({type:"error",offset:this.offset,message:t,source:e});this.offset+=e.length}else if(t==="scalar"){this.atNewLine=false;this.atScalar=true;this.type="scalar"}else{this.type=t;yield*this.step();switch(t){case"newline":this.atNewLine=true;this.indent=0;if(this.onNewLine)this.onNewLine(this.offset+e.length);break;case"space":if(this.atNewLine&&e[0]===" ")this.indent+=e.length;break;case"explicit-key-ind":case"map-value-ind":case"seq-item-ind":if(this.atNewLine)this.indent+=e.length;break;case"doc-mode":case"flow-error-end":return;default:this.atNewLine=false}this.offset+=e.length}}*end(){while(this.stack.length>0)yield*this.pop()}get sourceToken(){const e={type:this.type,offset:this.offset,indent:this.indent,source:this.source};return e}*step(){const e=this.peek(1);if(this.type==="doc-end"&&(!e||e.type!=="doc-end")){while(this.stack.length>0)yield*this.pop();this.stack.push({type:"doc-end",offset:this.offset,source:this.source});return}if(!e)return yield*this.stream();switch(e.type){case"document":return yield*this.document(e);case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return yield*this.scalar(e);case"block-scalar":return yield*this.blockScalar(e);case"block-map":return yield*this.blockMap(e);case"block-seq":return yield*this.blockSequence(e);case"flow-collection":return yield*this.flowCollection(e);case"doc-end":return yield*this.documentEnd(e)}yield*this.pop()}peek(e){return this.stack[this.stack.length-e]}*pop(e){const t=e??this.stack.pop();if(!t){const e="Tried to pop an empty stack";yield{type:"error",offset:this.offset,source:"",message:e}}else if(this.stack.length===0){yield t}else{const e=this.peek(1);if(t.type==="block-scalar"){t.indent="indent"in e?e.indent:0}else if(t.type==="flow-collection"&&e.type==="document"){t.indent=0}if(t.type==="flow-collection")fixFlowSeqItems(t);switch(e.type){case"document":e.value=t;break;case"block-scalar":e.props.push(t);break;case"block-map":{const n=e.items[e.items.length-1];if(n.value){e.items.push({start:[],key:t,sep:[]});this.onKeyLine=true;return}else if(n.sep){n.value=t}else{Object.assign(n,{key:t,sep:[]});this.onKeyLine=!includesToken(n.start,"explicit-key-ind");return}break}case"block-seq":{const n=e.items[e.items.length-1];if(n.value)e.items.push({start:[],value:t});else n.value=t;break}case"flow-collection":{const n=e.items[e.items.length-1];if(!n||n.value)e.items.push({start:[],key:t,sep:[]});else if(n.sep)n.value=t;else Object.assign(n,{key:t,sep:[]});return}default:yield*this.pop();yield*this.pop(t)}if((e.type==="document"||e.type==="block-map"||e.type==="block-seq")&&(t.type==="block-map"||t.type==="block-seq")){const n=t.items[t.items.length-1];if(n&&!n.sep&&!n.value&&n.start.length>0&&findNonEmptyIndex(n.start)===-1&&(t.indent===0||n.start.every((e=>e.type!=="comment"||e.indent<t.indent)))){if(e.type==="document")e.end=n.start;else e.items.push({start:n.start});t.items.splice(-1,1)}}}}*stream(){switch(this.type){case"directive-line":yield{type:"directive",offset:this.offset,source:this.source};return;case"byte-order-mark":case"space":case"comment":case"newline":yield this.sourceToken;return;case"doc-mode":case"doc-start":{const e={type:"document",offset:this.offset,start:[]};if(this.type==="doc-start")e.start.push(this.sourceToken);this.stack.push(e);return}}yield{type:"error",offset:this.offset,message:`Unexpected ${this.type} token in YAML stream`,source:this.source}}*document(e){if(e.value)return yield*this.lineEnd(e);switch(this.type){case"doc-start":{if(findNonEmptyIndex(e.start)!==-1){yield*this.pop();yield*this.step()}else e.start.push(this.sourceToken);return}case"anchor":case"tag":case"space":case"comment":case"newline":e.start.push(this.sourceToken);return}const t=this.startBlockValue(e);if(t)this.stack.push(t);else{yield{type:"error",offset:this.offset,message:`Unexpected ${this.type} token in YAML document`,source:this.source}}}*scalar(e){if(this.type==="map-value-ind"){const t=getPrevProps(this.peek(2));const n=getFirstKeyStartProps(t);let s;if(e.end){s=e.end;s.push(this.sourceToken);delete e.end}else s=[this.sourceToken];const i={type:"block-map",offset:e.offset,indent:e.indent,items:[{start:n,key:e,sep:s}]};this.onKeyLine=true;this.stack[this.stack.length-1]=i}else yield*this.lineEnd(e)}*blockScalar(e){switch(this.type){case"space":case"comment":case"newline":e.props.push(this.sourceToken);return;case"scalar":e.source=this.source;this.atNewLine=true;this.indent=0;if(this.onNewLine){let e=this.source.indexOf("\n")+1;while(e!==0){this.onNewLine(this.offset+e);e=this.source.indexOf("\n",e)+1}}yield*this.pop();break;default:yield*this.pop();yield*this.step()}}*blockMap(e){const t=e.items[e.items.length-1];switch(this.type){case"newline":this.onKeyLine=false;if(t.value){const n="end"in t.value?t.value.end:undefined;const s=Array.isArray(n)?n[n.length-1]:undefined;if(s?.type==="comment")n?.push(this.sourceToken);else e.items.push({start:[this.sourceToken]})}else if(t.sep){t.sep.push(this.sourceToken)}else{t.start.push(this.sourceToken)}return;case"space":case"comment":if(t.value){e.items.push({start:[this.sourceToken]})}else if(t.sep){t.sep.push(this.sourceToken)}else{if(this.atIndentedComment(t.start,e.indent)){const n=e.items[e.items.length-2];const s=n?.value?.end;if(Array.isArray(s)){Array.prototype.push.apply(s,t.start);s.push(this.sourceToken);e.items.pop();return}}t.start.push(this.sourceToken)}return}if(this.indent>=e.indent){const n=!this.onKeyLine&&this.indent===e.indent&&t.sep;let s=[];if(n&&t.sep&&!t.value){const n=[];for(let s=0;s<t.sep.length;++s){const i=t.sep[s];switch(i.type){case"newline":n.push(s);break;case"space":break;case"comment":if(i.indent>e.indent)n.length=0;break;default:n.length=0}}if(n.length>=2)s=t.sep.splice(n[1])}switch(this.type){case"anchor":case"tag":if(n||t.value){s.push(this.sourceToken);e.items.push({start:s});this.onKeyLine=true}else if(t.sep){t.sep.push(this.sourceToken)}else{t.start.push(this.sourceToken)}return;case"explicit-key-ind":if(!t.sep&&!includesToken(t.start,"explicit-key-ind")){t.start.push(this.sourceToken)}else if(n||t.value){s.push(this.sourceToken);e.items.push({start:s})}else{this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken]}]})}this.onKeyLine=true;return;case"map-value-ind":if(includesToken(t.start,"explicit-key-ind")){if(!t.sep){if(includesToken(t.start,"newline")){Object.assign(t,{key:null,sep:[this.sourceToken]})}else{const e=getFirstKeyStartProps(t.start);this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:e,key:null,sep:[this.sourceToken]}]})}}else if(t.value){e.items.push({start:[],key:null,sep:[this.sourceToken]})}else if(includesToken(t.sep,"map-value-ind")){this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:s,key:null,sep:[this.sourceToken]}]})}else if(isFlowToken(t.key)&&!includesToken(t.sep,"newline")){const e=getFirstKeyStartProps(t.start);const n=t.key;const s=t.sep;s.push(this.sourceToken);delete t.key,delete t.sep;this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:e,key:n,sep:s}]})}else if(s.length>0){t.sep=t.sep.concat(s,this.sourceToken)}else{t.sep.push(this.sourceToken)}}else{if(!t.sep){Object.assign(t,{key:null,sep:[this.sourceToken]})}else if(t.value||n){e.items.push({start:s,key:null,sep:[this.sourceToken]})}else if(includesToken(t.sep,"map-value-ind")){this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:[],key:null,sep:[this.sourceToken]}]})}else{t.sep.push(this.sourceToken)}}this.onKeyLine=true;return;case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":{const i=this.flowScalar(this.type);if(n||t.value){e.items.push({start:s,key:i,sep:[]});this.onKeyLine=true}else if(t.sep){this.stack.push(i)}else{Object.assign(t,{key:i,sep:[]});this.onKeyLine=true}return}default:{const i=this.startBlockValue(e);if(i){if(n&&i.type!=="block-seq"&&includesToken(t.start,"explicit-key-ind")){e.items.push({start:s})}this.stack.push(i);return}}}}yield*this.pop();yield*this.step()}*blockSequence(e){const t=e.items[e.items.length-1];switch(this.type){case"newline":if(t.value){const n="end"in t.value?t.value.end:undefined;const s=Array.isArray(n)?n[n.length-1]:undefined;if(s?.type==="comment")n?.push(this.sourceToken);else e.items.push({start:[this.sourceToken]})}else t.start.push(this.sourceToken);return;case"space":case"comment":if(t.value)e.items.push({start:[this.sourceToken]});else{if(this.atIndentedComment(t.start,e.indent)){const n=e.items[e.items.length-2];const s=n?.value?.end;if(Array.isArray(s)){Array.prototype.push.apply(s,t.start);s.push(this.sourceToken);e.items.pop();return}}t.start.push(this.sourceToken)}return;case"anchor":case"tag":if(t.value||this.indent<=e.indent)break;t.start.push(this.sourceToken);return;case"seq-item-ind":if(this.indent!==e.indent)break;if(t.value||includesToken(t.start,"seq-item-ind"))e.items.push({start:[this.sourceToken]});else t.start.push(this.sourceToken);return}if(this.indent>e.indent){const t=this.startBlockValue(e);if(t){this.stack.push(t);return}}yield*this.pop();yield*this.step()}*flowCollection(e){const t=e.items[e.items.length-1];if(this.type==="flow-error-end"){let e;do{yield*this.pop();e=this.peek(1)}while(e&&e.type==="flow-collection")}else if(e.end.length===0){switch(this.type){case"comma":case"explicit-key-ind":if(!t||t.sep)e.items.push({start:[this.sourceToken]});else t.start.push(this.sourceToken);return;case"map-value-ind":if(!t||t.value)e.items.push({start:[],key:null,sep:[this.sourceToken]});else if(t.sep)t.sep.push(this.sourceToken);else Object.assign(t,{key:null,sep:[this.sourceToken]});return;case"space":case"comment":case"newline":case"anchor":case"tag":if(!t||t.value)e.items.push({start:[this.sourceToken]});else if(t.sep)t.sep.push(this.sourceToken);else t.start.push(this.sourceToken);return;case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":{const n=this.flowScalar(this.type);if(!t||t.value)e.items.push({start:[],key:n,sep:[]});else if(t.sep)this.stack.push(n);else Object.assign(t,{key:n,sep:[]});return}case"flow-map-end":case"flow-seq-end":e.end.push(this.sourceToken);return}const n=this.startBlockValue(e);if(n)this.stack.push(n);else{yield*this.pop();yield*this.step()}}else{const t=this.peek(2);if(t.type==="block-map"&&(this.type==="map-value-ind"&&t.indent===e.indent||this.type==="newline"&&!t.items[t.items.length-1].sep)){yield*this.pop();yield*this.step()}else if(this.type==="map-value-ind"&&t.type!=="flow-collection"){const n=getPrevProps(t);const s=getFirstKeyStartProps(n);fixFlowSeqItems(e);const i=e.end.splice(1,e.end.length);i.push(this.sourceToken);const r={type:"block-map",offset:e.offset,indent:e.indent,items:[{start:s,key:e,sep:i}]};this.onKeyLine=true;this.stack[this.stack.length-1]=r}else{yield*this.lineEnd(e)}}}flowScalar(e){if(this.onNewLine){let e=this.source.indexOf("\n")+1;while(e!==0){this.onNewLine(this.offset+e);e=this.source.indexOf("\n",e)+1}}return{type:e,offset:this.offset,indent:this.indent,source:this.source}}startBlockValue(e){switch(this.type){case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return this.flowScalar(this.type);case"block-scalar-header":return{type:"block-scalar",offset:this.offset,indent:this.indent,props:[this.sourceToken],source:""};case"flow-map-start":case"flow-seq-start":return{type:"flow-collection",offset:this.offset,indent:this.indent,start:this.sourceToken,items:[],end:[]};case"seq-item-ind":return{type:"block-seq",offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken]}]};case"explicit-key-ind":{this.onKeyLine=true;const t=getPrevProps(e);const n=getFirstKeyStartProps(t);n.push(this.sourceToken);return{type:"block-map",offset:this.offset,indent:this.indent,items:[{start:n}]}}case"map-value-ind":{this.onKeyLine=true;const t=getPrevProps(e);const n=getFirstKeyStartProps(t);return{type:"block-map",offset:this.offset,indent:this.indent,items:[{start:n,key:null,sep:[this.sourceToken]}]}}}return null}atIndentedComment(e,t){if(this.type!=="comment")return false;if(this.indent<=t)return false;return e.every((e=>e.type==="newline"||e.type==="space"))}*documentEnd(e){if(this.type!=="doc-mode"){if(e.end)e.end.push(this.sourceToken);else e.end=[this.sourceToken];if(this.type==="newline")yield*this.pop()}}*lineEnd(e){switch(this.type){case"comma":case"doc-start":case"doc-end":case"flow-seq-end":case"flow-map-end":case"map-value-ind":yield*this.pop();yield*this.step();break;case"newline":this.onKeyLine=false;case"space":case"comment":default:if(e.end)e.end.push(this.sourceToken);else e.end=[this.sourceToken];if(this.type==="newline")yield*this.pop()}}}t.Parser=Parser},8649:(e,t,n)=>{var s=n(9493);var i=n(42);var r=n(4236);var o=n(6909);var a=n(1929);var c=n(3328);function parseOptions(e){const t=e.prettyErrors!==false;const n=e.lineCounter||t&&new a.LineCounter||null;return{lineCounter:n,prettyErrors:t}}function parseAllDocuments(e,t={}){const{lineCounter:n,prettyErrors:i}=parseOptions(t);const o=new c.Parser(n?.addNewLine);const a=new s.Composer(t);const l=Array.from(a.compose(o.parse(e)));if(i&&n)for(const t of l){t.errors.forEach(r.prettifyError(e,n));t.warnings.forEach(r.prettifyError(e,n))}if(l.length>0)return l;return Object.assign([],{empty:true},a.streamInfo())}function parseDocument(e,t={}){const{lineCounter:n,prettyErrors:i}=parseOptions(t);const o=new c.Parser(n?.addNewLine);const a=new s.Composer(t);let l=null;for(const t of a.compose(o.parse(e),true,e.length)){if(!l)l=t;else if(l.options.logLevel!=="silent"){l.errors.push(new r.YAMLParseError(t.range.slice(0,2),"MULTIPLE_DOCS","Source contains multiple documents; please use YAML.parseAllDocuments()"));break}}if(i&&n){l.errors.forEach(r.prettifyError(e,n));l.warnings.forEach(r.prettifyError(e,n))}return l}function parse(e,t,n){let s=undefined;if(typeof t==="function"){s=t}else if(n===undefined&&t&&typeof t==="object"){n=t}const i=parseDocument(e,n);if(!i)return null;i.warnings.forEach((e=>o.warn(i.options.logLevel,e)));if(i.errors.length>0){if(i.options.logLevel!=="silent")throw i.errors[0];else i.errors=[]}return i.toJS(Object.assign({reviver:s},n))}function stringify(e,t,n){let s=null;if(typeof t==="function"||Array.isArray(t)){s=t}else if(n===undefined&&t){n=t}if(typeof n==="string")n=n.length;if(typeof n==="number"){const e=Math.round(n);n=e<1?undefined:e>8?{indent:8}:{indent:e}}if(e===undefined){const{keepUndefined:e}=n??t??{};if(!e)return undefined}return new i.Document(e,s,n).toString(n)}t.parse=parse;t.parseAllDocuments=parseAllDocuments;t.parseDocument=parseDocument;t.stringify=stringify},6831:(e,t,n)=>{var s=n(1399);var i=n(83);var r=n(1693);var o=n(2201);var a=n(4138);const sortMapEntriesByKey=(e,t)=>e.key<t.key?-1:e.key>t.key?1:0;class Schema{constructor({compat:e,customTags:t,merge:n,resolveKnownTags:c,schema:l,sortMapEntries:f,toStringDefaults:u}){this.compat=Array.isArray(e)?a.getTags(e,"compat"):e?a.getTags(null,e):null;this.merge=!!n;this.name=typeof l==="string"&&l||"core";this.knownTags=c?a.coreKnownTags:{};this.tags=a.getTags(t,this.name);this.toStringOptions=u??null;Object.defineProperty(this,s.MAP,{value:i.map});Object.defineProperty(this,s.SCALAR,{value:o.string});Object.defineProperty(this,s.SEQ,{value:r.seq});this.sortMapEntries=typeof f==="function"?f:f===true?sortMapEntriesByKey:null}clone(){const e=Object.create(Schema.prototype,Object.getOwnPropertyDescriptors(this));e.tags=this.tags.slice();return e}}t.Schema=Schema},83:(e,t,n)=>{var s=n(1399);var i=n(246);var r=n(6011);function createMap(e,t,n){const{keepUndefined:s,replacer:o}=n;const a=new r.YAMLMap(e);const add=(e,r)=>{if(typeof o==="function")r=o.call(t,e,r);else if(Array.isArray(o)&&!o.includes(e))return;if(r!==undefined||s)a.items.push(i.createPair(e,r,n))};if(t instanceof Map){for(const[e,n]of t)add(e,n)}else if(t&&typeof t==="object"){for(const e of Object.keys(t))add(e,t[e])}if(typeof e.sortMapEntries==="function"){a.items.sort(e.sortMapEntries)}return a}const o={collection:"map",createNode:createMap,default:true,nodeClass:r.YAMLMap,tag:"tag:yaml.org,2002:map",resolve(e,t){if(!s.isMap(e))t("Expected a mapping for this tag");return e}};t.map=o},6703:(e,t,n)=>{var s=n(9338);const i={identify:e=>e==null,createNode:()=>new s.Scalar(null),default:true,tag:"tag:yaml.org,2002:null",test:/^(?:~|[Nn]ull|NULL)?$/,resolve:()=>new s.Scalar(null),stringify:({source:e},t)=>typeof e==="string"&&i.test.test(e)?e:t.options.nullStr};t.nullTag=i},1693:(e,t,n)=>{var s=n(9652);var i=n(1399);var r=n(5161);function createSeq(e,t,n){const{replacer:i}=n;const o=new r.YAMLSeq(e);if(t&&Symbol.iterator in Object(t)){let e=0;for(let r of t){if(typeof i==="function"){const n=t instanceof Set?r:String(e++);r=i.call(t,n,r)}o.items.push(s.createNode(r,undefined,n))}}return o}const o={collection:"seq",createNode:createSeq,default:true,nodeClass:r.YAMLSeq,tag:"tag:yaml.org,2002:seq",resolve(e,t){if(!i.isSeq(e))t("Expected a sequence for this tag");return e}};t.seq=o},2201:(e,t,n)=>{var s=n(6226);const i={identify:e=>typeof e==="string",default:true,tag:"tag:yaml.org,2002:str",resolve:e=>e,stringify(e,t,n,i){t=Object.assign({actualString:true},t);return s.stringifyString(e,t,n,i)}};t.string=i},2045:(e,t,n)=>{var s=n(9338);const i={identify:e=>typeof e==="boolean",default:true,tag:"tag:yaml.org,2002:bool",test:/^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,resolve:e=>new s.Scalar(e[0]==="t"||e[0]==="T"),stringify({source:e,value:t},n){if(e&&i.test.test(e)){const n=e[0]==="t"||e[0]==="T";if(t===n)return e}return t?n.options.trueStr:n.options.falseStr}};t.boolTag=i},6810:(e,t,n)=>{var s=n(9338);var i=n(4174);const r={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^(?:[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN))$/,resolve:e=>e.slice(-3).toLowerCase()==="nan"?NaN:e[0]==="-"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,stringify:i.stringifyNumber};const o={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",format:"EXP",test:/^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e),stringify(e){const t=Number(e.value);return isFinite(t)?t.toExponential():i.stringifyNumber(e)}};const a={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,resolve(e){const t=new s.Scalar(parseFloat(e));const n=e.indexOf(".");if(n!==-1&&e[e.length-1]==="0")t.minFractionDigits=e.length-n-1;return t},stringify:i.stringifyNumber};t.float=a;t.floatExp=o;t.floatNaN=r},3019:(e,t,n)=>{var s=n(4174);const intIdentify=e=>typeof e==="bigint"||Number.isInteger(e);const intResolve=(e,t,n,{intAsBigInt:s})=>s?BigInt(e):parseInt(e.substring(t),n);function intStringify(e,t,n){const{value:i}=e;if(intIdentify(i)&&i>=0)return n+i.toString(t);return s.stringifyNumber(e)}const i={identify:e=>intIdentify(e)&&e>=0,default:true,tag:"tag:yaml.org,2002:int",format:"OCT",test:/^0o[0-7]+$/,resolve:(e,t,n)=>intResolve(e,2,8,n),stringify:e=>intStringify(e,8,"0o")};const r={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",test:/^[-+]?[0-9]+$/,resolve:(e,t,n)=>intResolve(e,0,10,n),stringify:s.stringifyNumber};const o={identify:e=>intIdentify(e)&&e>=0,default:true,tag:"tag:yaml.org,2002:int",format:"HEX",test:/^0x[0-9a-fA-F]+$/,resolve:(e,t,n)=>intResolve(e,2,16,n),stringify:e=>intStringify(e,16,"0x")};t.int=r;t.intHex=o;t.intOct=i},27:(e,t,n)=>{var s=n(83);var i=n(6703);var r=n(1693);var o=n(2201);var a=n(2045);var c=n(6810);var l=n(3019);const f=[s.map,r.seq,o.string,i.nullTag,a.boolTag,l.intOct,l.int,l.intHex,c.floatNaN,c.floatExp,c.float];t.schema=f},4545:(e,t,n)=>{var s=n(9338);var i=n(83);var r=n(1693);function intIdentify(e){return typeof e==="bigint"||Number.isInteger(e)}const stringifyJSON=({value:e})=>JSON.stringify(e);const o=[{identify:e=>typeof e==="string",default:true,tag:"tag:yaml.org,2002:str",resolve:e=>e,stringify:stringifyJSON},{identify:e=>e==null,createNode:()=>new s.Scalar(null),default:true,tag:"tag:yaml.org,2002:null",test:/^null$/,resolve:()=>null,stringify:stringifyJSON},{identify:e=>typeof e==="boolean",default:true,tag:"tag:yaml.org,2002:bool",test:/^true|false$/,resolve:e=>e==="true",stringify:stringifyJSON},{identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",test:/^-?(?:0|[1-9][0-9]*)$/,resolve:(e,t,{intAsBigInt:n})=>n?BigInt(e):parseInt(e,10),stringify:({value:e})=>intIdentify(e)?e.toString():JSON.stringify(e)},{identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,resolve:e=>parseFloat(e),stringify:stringifyJSON}];const a={default:true,tag:"",test:/^/,resolve(e,t){t(`Unresolved plain scalar ${JSON.stringify(e)}`);return e}};const c=[i.map,r.seq].concat(o,a);t.schema=c},4138:(e,t,n)=>{var s=n(83);var i=n(6703);var r=n(1693);var o=n(2201);var a=n(2045);var c=n(6810);var l=n(3019);var f=n(27);var u=n(4545);var d=n(5724);var h=n(8974);var p=n(9841);var m=n(5389);var y=n(7847);var g=n(1156);const v=new Map([["core",f.schema],["failsafe",[s.map,r.seq,o.string]],["json",u.schema],["yaml11",m.schema],["yaml-1.1",m.schema]]);const b={binary:d.binary,bool:a.boolTag,float:c.float,floatExp:c.floatExp,floatNaN:c.floatNaN,floatTime:g.floatTime,int:l.int,intHex:l.intHex,intOct:l.intOct,intTime:g.intTime,map:s.map,null:i.nullTag,omap:h.omap,pairs:p.pairs,seq:r.seq,set:y.set,timestamp:g.timestamp};const S={"tag:yaml.org,2002:binary":d.binary,"tag:yaml.org,2002:omap":h.omap,"tag:yaml.org,2002:pairs":p.pairs,"tag:yaml.org,2002:set":y.set,"tag:yaml.org,2002:timestamp":g.timestamp};function getTags(e,t){let n=v.get(t);if(!n){if(Array.isArray(e))n=[];else{const e=Array.from(v.keys()).filter((e=>e!=="yaml11")).map((e=>JSON.stringify(e))).join(", ");throw new Error(`Unknown schema "${t}"; use one of ${e} or define customTags array`)}}if(Array.isArray(e)){for(const t of e)n=n.concat(t)}else if(typeof e==="function"){n=e(n.slice())}return n.map((e=>{if(typeof e!=="string")return e;const t=b[e];if(t)return t;const n=Object.keys(b).map((e=>JSON.stringify(e))).join(", ");throw new Error(`Unknown custom tag "${e}"; use one of ${n}`)}))}t.coreKnownTags=S;t.getTags=getTags},5724:(e,t,n)=>{var s=n(9338);var i=n(6226);const r={identify:e=>e instanceof Uint8Array,default:false,tag:"tag:yaml.org,2002:binary",resolve(e,t){if(typeof Buffer==="function"){return Buffer.from(e,"base64")}else if(typeof atob==="function"){const t=atob(e.replace(/[\n\r]/g,""));const n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n[e]=t.charCodeAt(e);return n}else{t("This environment does not support reading binary tags; either Buffer or atob is required");return e}},stringify({comment:e,type:t,value:n},r,o,a){const c=n;let l;if(typeof Buffer==="function"){l=c instanceof Buffer?c.toString("base64"):Buffer.from(c.buffer).toString("base64")}else if(typeof btoa==="function"){let e="";for(let t=0;t<c.length;++t)e+=String.fromCharCode(c[t]);l=btoa(e)}else{throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required")}if(!t)t=s.Scalar.BLOCK_LITERAL;if(t!==s.Scalar.QUOTE_DOUBLE){const e=Math.max(r.options.lineWidth-r.indent.length,r.options.minContentWidth);const n=Math.ceil(l.length/e);const i=new Array(n);for(let t=0,s=0;t<n;++t,s+=e){i[t]=l.substr(s,e)}l=i.join(t===s.Scalar.BLOCK_LITERAL?"\n":" ")}return i.stringifyString({comment:e,type:t,value:l},r,o,a)}};t.binary=r},2631:(e,t,n)=>{var s=n(9338);function boolStringify({value:e,source:t},n){const s=e?i:r;if(t&&s.test.test(t))return t;return e?n.options.trueStr:n.options.falseStr}const i={identify:e=>e===true,default:true,tag:"tag:yaml.org,2002:bool",test:/^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,resolve:()=>new s.Scalar(true),stringify:boolStringify};const r={identify:e=>e===false,default:true,tag:"tag:yaml.org,2002:bool",test:/^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,resolve:()=>new s.Scalar(false),stringify:boolStringify};t.falseTag=r;t.trueTag=i},8035:(e,t,n)=>{var s=n(9338);var i=n(4174);const r={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN)$/,resolve:e=>e.slice(-3).toLowerCase()==="nan"?NaN:e[0]==="-"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,stringify:i.stringifyNumber};const o={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",format:"EXP",test:/^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e.replace(/_/g,"")),stringify(e){const t=Number(e.value);return isFinite(t)?t.toExponential():i.stringifyNumber(e)}};const a={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,resolve(e){const t=new s.Scalar(parseFloat(e.replace(/_/g,"")));const n=e.indexOf(".");if(n!==-1){const s=e.substring(n+1).replace(/_/g,"");if(s[s.length-1]==="0")t.minFractionDigits=s.length}return t},stringify:i.stringifyNumber};t.float=a;t.floatExp=o;t.floatNaN=r},9503:(e,t,n)=>{var s=n(4174);const intIdentify=e=>typeof e==="bigint"||Number.isInteger(e);function intResolve(e,t,n,{intAsBigInt:s}){const i=e[0];if(i==="-"||i==="+")t+=1;e=e.substring(t).replace(/_/g,"");if(s){switch(n){case 2:e=`0b${e}`;break;case 8:e=`0o${e}`;break;case 16:e=`0x${e}`;break}const t=BigInt(e);return i==="-"?BigInt(-1)*t:t}const r=parseInt(e,n);return i==="-"?-1*r:r}function intStringify(e,t,n){const{value:i}=e;if(intIdentify(i)){const e=i.toString(t);return i<0?"-"+n+e.substr(1):n+e}return s.stringifyNumber(e)}const i={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",format:"BIN",test:/^[-+]?0b[0-1_]+$/,resolve:(e,t,n)=>intResolve(e,2,2,n),stringify:e=>intStringify(e,2,"0b")};const r={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",format:"OCT",test:/^[-+]?0[0-7_]+$/,resolve:(e,t,n)=>intResolve(e,1,8,n),stringify:e=>intStringify(e,8,"0")};const o={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",test:/^[-+]?[0-9][0-9_]*$/,resolve:(e,t,n)=>intResolve(e,0,10,n),stringify:s.stringifyNumber};const a={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",format:"HEX",test:/^[-+]?0x[0-9a-fA-F_]+$/,resolve:(e,t,n)=>intResolve(e,2,16,n),stringify:e=>intStringify(e,16,"0x")};t.int=o;t.intBin=i;t.intHex=a;t.intOct=r},8974:(e,t,n)=>{var s=n(5161);var i=n(2463);var r=n(1399);var o=n(6011);var a=n(9841);class YAMLOMap extends s.YAMLSeq{constructor(){super();this.add=o.YAMLMap.prototype.add.bind(this);this.delete=o.YAMLMap.prototype.delete.bind(this);this.get=o.YAMLMap.prototype.get.bind(this);this.has=o.YAMLMap.prototype.has.bind(this);this.set=o.YAMLMap.prototype.set.bind(this);this.tag=YAMLOMap.tag}toJSON(e,t){if(!t)return super.toJSON(e);const n=new Map;if(t?.onCreate)t.onCreate(n);for(const e of this.items){let s,o;if(r.isPair(e)){s=i.toJS(e.key,"",t);o=i.toJS(e.value,s,t)}else{s=i.toJS(e,"",t)}if(n.has(s))throw new Error("Ordered maps must not include duplicate keys");n.set(s,o)}return n}}YAMLOMap.tag="tag:yaml.org,2002:omap";const c={collection:"seq",identify:e=>e instanceof Map,nodeClass:YAMLOMap,default:false,tag:"tag:yaml.org,2002:omap",resolve(e,t){const n=a.resolvePairs(e,t);const s=[];for(const{key:e}of n.items){if(r.isScalar(e)){if(s.includes(e.value)){t(`Ordered maps must not include duplicate keys: ${e.value}`)}else{s.push(e.value)}}}return Object.assign(new YAMLOMap,n)},createNode(e,t,n){const s=a.createPairs(e,t,n);const i=new YAMLOMap;i.items=s.items;return i}};t.YAMLOMap=YAMLOMap;t.omap=c},9841:(e,t,n)=>{var s=n(1399);var i=n(246);var r=n(9338);var o=n(5161);function resolvePairs(e,t){if(s.isSeq(e)){for(let n=0;n<e.items.length;++n){let o=e.items[n];if(s.isPair(o))continue;else if(s.isMap(o)){if(o.items.length>1)t("Each pair must have its own sequence indicator");const e=o.items[0]||new i.Pair(new r.Scalar(null));if(o.commentBefore)e.key.commentBefore=e.key.commentBefore?`${o.commentBefore}\n${e.key.commentBefore}`:o.commentBefore;if(o.comment){const t=e.value??e.key;t.comment=t.comment?`${o.comment}\n${t.comment}`:o.comment}o=e}e.items[n]=s.isPair(o)?o:new i.Pair(o)}}else t("Expected a sequence for this tag");return e}function createPairs(e,t,n){const{replacer:s}=n;const r=new o.YAMLSeq(e);r.tag="tag:yaml.org,2002:pairs";let a=0;if(t&&Symbol.iterator in Object(t))for(let e of t){if(typeof s==="function")e=s.call(t,String(a++),e);let o,c;if(Array.isArray(e)){if(e.length===2){o=e[0];c=e[1]}else throw new TypeError(`Expected [key, value] tuple: ${e}`)}else if(e&&e instanceof Object){const t=Object.keys(e);if(t.length===1){o=t[0];c=e[o]}else throw new TypeError(`Expected { key: value } tuple: ${e}`)}else{o=e}r.items.push(i.createPair(o,c,n))}return r}const a={collection:"seq",default:false,tag:"tag:yaml.org,2002:pairs",resolve:resolvePairs,createNode:createPairs};t.createPairs=createPairs;t.pairs=a;t.resolvePairs=resolvePairs},5389:(e,t,n)=>{var s=n(83);var i=n(6703);var r=n(1693);var o=n(2201);var a=n(5724);var c=n(2631);var l=n(8035);var f=n(9503);var u=n(8974);var d=n(9841);var h=n(7847);var p=n(1156);const m=[s.map,r.seq,o.string,i.nullTag,c.trueTag,c.falseTag,f.intBin,f.intOct,f.int,f.intHex,l.floatNaN,l.floatExp,l.float,a.binary,u.omap,d.pairs,h.set,p.intTime,p.floatTime,p.timestamp];t.schema=m},7847:(e,t,n)=>{var s=n(1399);var i=n(246);var r=n(6011);class YAMLSet extends r.YAMLMap{constructor(e){super(e);this.tag=YAMLSet.tag}add(e){let t;if(s.isPair(e))t=e;else if(e&&typeof e==="object"&&"key"in e&&"value"in e&&e.value===null)t=new i.Pair(e.key,null);else t=new i.Pair(e,null);const n=r.findPair(this.items,t.key);if(!n)this.items.push(t)}get(e,t){const n=r.findPair(this.items,e);return!t&&s.isPair(n)?s.isScalar(n.key)?n.key.value:n.key:n}set(e,t){if(typeof t!=="boolean")throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);const n=r.findPair(this.items,e);if(n&&!t){this.items.splice(this.items.indexOf(n),1)}else if(!n&&t){this.items.push(new i.Pair(e))}}toJSON(e,t){return super.toJSON(e,t,Set)}toString(e,t,n){if(!e)return JSON.stringify(this);if(this.hasAllNullValues(true))return super.toString(Object.assign({},e,{allNullValues:true}),t,n);else throw new Error("Set items must all have null values")}}YAMLSet.tag="tag:yaml.org,2002:set";const o={collection:"map",identify:e=>e instanceof Set,nodeClass:YAMLSet,default:false,tag:"tag:yaml.org,2002:set",resolve(e,t){if(s.isMap(e)){if(e.hasAllNullValues(true))return Object.assign(new YAMLSet,e);else t("Set items must all have null values")}else t("Expected a mapping for this tag");return e},createNode(e,t,n){const{replacer:s}=n;const r=new YAMLSet(e);if(t&&Symbol.iterator in Object(t))for(let e of t){if(typeof s==="function")e=s.call(t,e,e);r.items.push(i.createPair(e,null,n))}return r}};t.YAMLSet=YAMLSet;t.set=o},1156:(e,t,n)=>{var s=n(4174);function parseSexagesimal(e,t){const n=e[0];const s=n==="-"||n==="+"?e.substring(1):e;const num=e=>t?BigInt(e):Number(e);const i=s.replace(/_/g,"").split(":").reduce(((e,t)=>e*num(60)+num(t)),num(0));return n==="-"?num(-1)*i:i}function stringifySexagesimal(e){let{value:t}=e;let num=e=>e;if(typeof t==="bigint")num=e=>BigInt(e);else if(isNaN(t)||!isFinite(t))return s.stringifyNumber(e);let n="";if(t<0){n="-";t*=num(-1)}const i=num(60);const r=[t%i];if(t<60){r.unshift(0)}else{t=(t-r[0])/i;r.unshift(t%i);if(t>=60){t=(t-r[0])/i;r.unshift(t)}}return n+r.map((e=>e<10?"0"+String(e):String(e))).join(":").replace(/000000\d*$/,"")}const i={identify:e=>typeof e==="bigint"||Number.isInteger(e),default:true,tag:"tag:yaml.org,2002:int",format:"TIME",test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,resolve:(e,t,{intAsBigInt:n})=>parseSexagesimal(e,n),stringify:stringifySexagesimal};const r={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",format:"TIME",test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,resolve:e=>parseSexagesimal(e,false),stringify:stringifySexagesimal};const o={identify:e=>e instanceof Date,default:true,tag:"tag:yaml.org,2002:timestamp",test:RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})"+"(?:"+"(?:t|T|[ \\t]+)"+"([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)"+"(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?"+")?$"),resolve(e){const t=e.match(o.test);if(!t)throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");const[,n,s,i,r,a,c]=t.map(Number);const l=t[7]?Number((t[7]+"00").substr(1,3)):0;let f=Date.UTC(n,s-1,i,r||0,a||0,c||0,l);const u=t[8];if(u&&u!=="Z"){let e=parseSexagesimal(u,false);if(Math.abs(e)<30)e*=60;f-=6e4*e}return new Date(f)},stringify:({value:e})=>e.toISOString().replace(/((T00:00)?:00)?\.000Z$/,"")};t.floatTime=r;t.intTime=i;t.timestamp=o},2889:(e,t)=>{const n="flow";const s="block";const i="quoted";function foldFlowLines(e,t,n="flow",{indentAtStart:r,lineWidth:o=80,minContentWidth:a=20,onFold:c,onOverflow:l}={}){if(!o||o<0)return e;const f=Math.max(1+a,1+o-t.length);if(e.length<=f)return e;const u=[];const d={};let h=o-t.length;if(typeof r==="number"){if(r>o-Math.max(2,a))u.push(0);else h=o-r}let p=undefined;let m=undefined;let y=false;let g=-1;let v=-1;let b=-1;if(n===s){g=consumeMoreIndentedLines(e,g);if(g!==-1)h=g+f}for(let t;t=e[g+=1];){if(n===i&&t==="\\"){v=g;switch(e[g+1]){case"x":g+=3;break;case"u":g+=5;break;case"U":g+=9;break;default:g+=1}b=g}if(t==="\n"){if(n===s)g=consumeMoreIndentedLines(e,g);h=g+f;p=undefined}else{if(t===" "&&m&&m!==" "&&m!=="\n"&&m!=="\t"){const t=e[g+1];if(t&&t!==" "&&t!=="\n"&&t!=="\t")p=g}if(g>=h){if(p){u.push(p);h=p+f;p=undefined}else if(n===i){while(m===" "||m==="\t"){m=t;t=e[g+=1];y=true}const n=g>b+1?g-2:v-1;if(d[n])return e;u.push(n);d[n]=true;h=n+f;p=undefined}else{y=true}}}m=t}if(y&&l)l();if(u.length===0)return e;if(c)c();let S=e.slice(0,u[0]);for(let s=0;s<u.length;++s){const r=u[s];const o=u[s+1]||e.length;if(r===0)S=`\n${t}${e.slice(0,o)}`;else{if(n===i&&d[r])S+=`${e[r]}\\`;S+=`\n${t}${e.slice(r+1,o)}`}}return S}function consumeMoreIndentedLines(e,t){let n=e[t+1];while(n===" "||n==="\t"){do{n=e[t+=1]}while(n&&n!=="\n");n=e[t+1]}return t}t.FOLD_BLOCK=s;t.FOLD_FLOW=n;t.FOLD_QUOTED=i;t.foldFlowLines=foldFlowLines},8409:(e,t,n)=>{var s=n(8459);var i=n(1399);var r=n(5182);var o=n(6226);function createStringifyContext(e,t){const n=Object.assign({blockQuote:true,commentString:r.stringifyComment,defaultKeyType:null,defaultStringType:"PLAIN",directives:null,doubleQuotedAsJSON:false,doubleQuotedMinMultiLineLength:40,falseStr:"false",indentSeq:true,lineWidth:80,minContentWidth:20,nullStr:"null",simpleKeys:false,singleQuote:null,trueStr:"true",verifyAliasOrder:true},e.schema.toStringOptions,t);let s;switch(n.collectionStyle){case"block":s=false;break;case"flow":s=true;break;default:s=null}return{anchors:new Set,doc:e,indent:"",indentStep:typeof n.indent==="number"?" ".repeat(n.indent):"  ",inFlow:s,options:n}}function getTagObject(e,t){if(t.tag){const n=e.filter((e=>e.tag===t.tag));if(n.length>0)return n.find((e=>e.format===t.format))??n[0]}let n=undefined;let s;if(i.isScalar(t)){s=t.value;const i=e.filter((e=>e.identify?.(s)));n=i.find((e=>e.format===t.format))??i.find((e=>!e.format))}else{s=t;n=e.find((e=>e.nodeClass&&s instanceof e.nodeClass))}if(!n){const e=s?.constructor?.name??typeof s;throw new Error(`Tag not resolved for ${e} value`)}return n}function stringifyProps(e,t,{anchors:n,doc:r}){if(!r.directives)return"";const o=[];const a=(i.isScalar(e)||i.isCollection(e))&&e.anchor;if(a&&s.anchorIsValid(a)){n.add(a);o.push(`&${a}`)}const c=e.tag?e.tag:t.default?null:t.tag;if(c)o.push(r.directives.tagString(c));return o.join(" ")}function stringify(e,t,n,s){if(i.isPair(e))return e.toString(t,n,s);if(i.isAlias(e)){if(t.doc.directives)return e.toString(t);if(t.resolvedAliases?.has(e)){throw new TypeError(`Cannot stringify circular structure without alias nodes`)}else{if(t.resolvedAliases)t.resolvedAliases.add(e);else t.resolvedAliases=new Set([e]);e=e.resolve(t.doc)}}let r=undefined;const a=i.isNode(e)?e:t.doc.createNode(e,{onTagObj:e=>r=e});if(!r)r=getTagObject(t.doc.schema.tags,a);const c=stringifyProps(a,r,t);if(c.length>0)t.indentAtStart=(t.indentAtStart??0)+c.length+1;const l=typeof r.stringify==="function"?r.stringify(a,t,n,s):i.isScalar(a)?o.stringifyString(a,t,n,s):a.toString(t,n,s);if(!c)return l;return i.isScalar(a)||l[0]==="{"||l[0]==="["?`${c} ${l}`:`${c}\n${t.indent}${l}`}t.createStringifyContext=createStringifyContext;t.stringify=stringify},2466:(e,t,n)=>{var s=n(3466);var i=n(1399);var r=n(8409);var o=n(5182);function stringifyCollection(e,t,n){const s=t.inFlow??e.flow;const i=s?stringifyFlowCollection:stringifyBlockCollection;return i(e,t,n)}function stringifyBlockCollection({comment:e,items:t},n,{blockItemPrefix:s,flowChars:a,itemIndent:c,onChompKeep:l,onComment:f}){const{indent:u,options:{commentString:d}}=n;const h=Object.assign({},n,{indent:c,type:null});let p=false;const m=[];for(let e=0;e<t.length;++e){const a=t[e];let l=null;if(i.isNode(a)){if(!p&&a.spaceBefore)m.push("");addCommentBefore(n,m,a.commentBefore,p);if(a.comment)l=a.comment}else if(i.isPair(a)){const e=i.isNode(a.key)?a.key:null;if(e){if(!p&&e.spaceBefore)m.push("");addCommentBefore(n,m,e.commentBefore,p)}}p=false;let f=r.stringify(a,h,(()=>l=null),(()=>p=true));if(l)f+=o.lineComment(f,c,d(l));if(p&&l)p=false;m.push(s+f)}let y;if(m.length===0){y=a.start+a.end}else{y=m[0];for(let e=1;e<m.length;++e){const t=m[e];y+=t?`\n${u}${t}`:"\n"}}if(e){y+="\n"+o.indentComment(d(e),u);if(f)f()}else if(p&&l)l();return y}function stringifyFlowCollection({comment:e,items:t},n,{flowChars:a,itemIndent:c,onComment:l}){const{indent:f,indentStep:u,options:{commentString:d}}=n;c+=u;const h=Object.assign({},n,{indent:c,inFlow:true,type:null});let p=false;let m=0;const y=[];for(let e=0;e<t.length;++e){const s=t[e];let a=null;if(i.isNode(s)){if(s.spaceBefore)y.push("");addCommentBefore(n,y,s.commentBefore,false);if(s.comment)a=s.comment}else if(i.isPair(s)){const e=i.isNode(s.key)?s.key:null;if(e){if(e.spaceBefore)y.push("");addCommentBefore(n,y,e.commentBefore,false);if(e.comment)p=true}const t=i.isNode(s.value)?s.value:null;if(t){if(t.comment)a=t.comment;if(t.commentBefore)p=true}else if(s.value==null&&e&&e.comment){a=e.comment}}if(a)p=true;let l=r.stringify(s,h,(()=>a=null));if(e<t.length-1)l+=",";if(a)l+=o.lineComment(l,c,d(a));if(!p&&(y.length>m||l.includes("\n")))p=true;y.push(l);m=y.length}let g;const{start:v,end:b}=a;if(y.length===0){g=v+b}else{if(!p){const e=y.reduce(((e,t)=>e+t.length+2),2);p=e>s.Collection.maxFlowStringSingleLineLength}if(p){g=v;for(const e of y)g+=e?`\n${u}${f}${e}`:"\n";g+=`\n${f}${b}`}else{g=`${v} ${y.join(" ")} ${b}`}}if(e){g+=o.lineComment(g,d(e),f);if(l)l()}return g}function addCommentBefore({indent:e,options:{commentString:t}},n,s,i){if(s&&i)s=s.replace(/^\n+/,"");if(s){const i=o.indentComment(t(s),e);n.push(i.trimStart())}}t.stringifyCollection=stringifyCollection},5182:(e,t)=>{const stringifyComment=e=>e.replace(/^(?!$)(?: $)?/gm,"#");function indentComment(e,t){if(/^\n+$/.test(e))return e.substring(1);return t?e.replace(/^(?! *$)/gm,t):e}const lineComment=(e,t,n)=>e.endsWith("\n")?indentComment(n,t):n.includes("\n")?"\n"+indentComment(n,t):(e.endsWith(" ")?"":" ")+n;t.indentComment=indentComment;t.lineComment=lineComment;t.stringifyComment=stringifyComment},5225:(e,t,n)=>{var s=n(1399);var i=n(8409);var r=n(5182);function stringifyDocument(e,t){const n=[];let o=t.directives===true;if(t.directives!==false&&e.directives){const t=e.directives.toString(e);if(t){n.push(t);o=true}else if(e.directives.docStart)o=true}if(o)n.push("---");const a=i.createStringifyContext(e,t);const{commentString:c}=a.options;if(e.commentBefore){if(n.length!==1)n.unshift("");const t=c(e.commentBefore);n.unshift(r.indentComment(t,""))}let l=false;let f=null;if(e.contents){if(s.isNode(e.contents)){if(e.contents.spaceBefore&&o)n.push("");if(e.contents.commentBefore){const t=c(e.contents.commentBefore);n.push(r.indentComment(t,""))}a.forceBlockIndent=!!e.comment;f=e.contents.comment}const t=f?undefined:()=>l=true;let u=i.stringify(e.contents,a,(()=>f=null),t);if(f)u+=r.lineComment(u,"",c(f));if((u[0]==="|"||u[0]===">")&&n[n.length-1]==="---"){n[n.length-1]=`--- ${u}`}else n.push(u)}else{n.push(i.stringify(e.contents,a))}if(e.directives?.docEnd){if(e.comment){const t=c(e.comment);if(t.includes("\n")){n.push("...");n.push(r.indentComment(t,""))}else{n.push(`... ${t}`)}}else{n.push("...")}}else{let t=e.comment;if(t&&l)t=t.replace(/^\n+/,"");if(t){if((!l||f)&&n[n.length-1]!=="")n.push("");n.push(r.indentComment(c(t),""))}}return n.join("\n")+"\n"}t.stringifyDocument=stringifyDocument},4174:(e,t)=>{function stringifyNumber({format:e,minFractionDigits:t,tag:n,value:s}){if(typeof s==="bigint")return String(s);const i=typeof s==="number"?s:Number(s);if(!isFinite(i))return isNaN(i)?".nan":i<0?"-.inf":".inf";let r=JSON.stringify(s);if(!e&&t&&(!n||n==="tag:yaml.org,2002:float")&&/^\d/.test(r)){let e=r.indexOf(".");if(e<0){e=r.length;r+="."}let n=t-(r.length-e-1);while(n-- >0)r+="0"}return r}t.stringifyNumber=stringifyNumber},4875:(e,t,n)=>{var s=n(1399);var i=n(9338);var r=n(8409);var o=n(5182);function stringifyPair({key:e,value:t},n,a,c){const{allNullValues:l,doc:f,indent:u,indentStep:d,options:{commentString:h,indentSeq:p,simpleKeys:m}}=n;let y=s.isNode(e)&&e.comment||null;if(m){if(y){throw new Error("With simple keys, key nodes cannot have comments")}if(s.isCollection(e)){const e="With simple keys, collection cannot be used as a key value";throw new Error(e)}}let g=!m&&(!e||y&&t==null&&!n.inFlow||s.isCollection(e)||(s.isScalar(e)?e.type===i.Scalar.BLOCK_FOLDED||e.type===i.Scalar.BLOCK_LITERAL:typeof e==="object"));n=Object.assign({},n,{allNullValues:false,implicitKey:!g&&(m||!l),indent:u+d});let v=false;let b=false;let S=r.stringify(e,n,(()=>v=true),(()=>b=true));if(!g&&!n.inFlow&&S.length>1024){if(m)throw new Error("With simple keys, single line scalar must not span more than 1024 characters");g=true}if(n.inFlow){if(l||t==null){if(v&&a)a();return S===""?"?":g?`? ${S}`:S}}else if(l&&!m||t==null&&g){S=`? ${S}`;if(y&&!v){S+=o.lineComment(S,n.indent,h(y))}else if(b&&c)c();return S}if(v)y=null;if(g){if(y)S+=o.lineComment(S,n.indent,h(y));S=`? ${S}\n${u}:`}else{S=`${S}:`;if(y)S+=o.lineComment(S,n.indent,h(y))}let w="";let k=null;if(s.isNode(t)){if(t.spaceBefore)w="\n";if(t.commentBefore){const e=h(t.commentBefore);w+=`\n${o.indentComment(e,n.indent)}`}k=t.comment}else if(t&&typeof t==="object"){t=f.createNode(t)}n.implicitKey=false;if(!g&&!y&&s.isScalar(t))n.indentAtStart=S.length+1;b=false;if(!p&&d.length>=2&&!n.inFlow&&!g&&s.isSeq(t)&&!t.flow&&!t.tag&&!t.anchor){n.indent=n.indent.substr(2)}let E=false;const A=r.stringify(t,n,(()=>E=true),(()=>b=true));let N=" ";if(w||y){if(A===""&&!n.inFlow)N=w==="\n"?"\n\n":w;else N=`${w}\n${n.indent}`}else if(!g&&s.isCollection(t)){const e=A[0]==="["||A[0]==="{";if(!e||A.includes("\n"))N=`\n${n.indent}`}else if(A===""||A[0]==="\n")N="";S+=N+A;if(n.inFlow){if(E&&a)a()}else if(k&&!E){S+=o.lineComment(S,n.indent,h(k))}else if(b&&c){c()}return S}t.stringifyPair=stringifyPair},6226:(e,t,n)=>{var s=n(9338);var i=n(2889);const getFoldOptions=e=>({indentAtStart:e.indentAtStart,lineWidth:e.options.lineWidth,minContentWidth:e.options.minContentWidth});const containsDocumentMarker=e=>/^(%|---|\.\.\.)/m.test(e);function lineLengthOverLimit(e,t,n){if(!t||t<0)return false;const s=t-n;const i=e.length;if(i<=s)return false;for(let t=0,n=0;t<i;++t){if(e[t]==="\n"){if(t-n>s)return true;n=t+1;if(i-n<=s)return false}}return true}function doubleQuotedString(e,t){const n=JSON.stringify(e);if(t.options.doubleQuotedAsJSON)return n;const{implicitKey:s}=t;const r=t.options.doubleQuotedMinMultiLineLength;const o=t.indent||(containsDocumentMarker(e)?"  ":"");let a="";let c=0;for(let e=0,t=n[e];t;t=n[++e]){if(t===" "&&n[e+1]==="\\"&&n[e+2]==="n"){a+=n.slice(c,e)+"\\ ";e+=1;c=e;t="\\"}if(t==="\\")switch(n[e+1]){case"u":{a+=n.slice(c,e);const t=n.substr(e+2,4);switch(t){case"0000":a+="\\0";break;case"0007":a+="\\a";break;case"000b":a+="\\v";break;case"001b":a+="\\e";break;case"0085":a+="\\N";break;case"00a0":a+="\\_";break;case"2028":a+="\\L";break;case"2029":a+="\\P";break;default:if(t.substr(0,2)==="00")a+="\\x"+t.substr(2);else a+=n.substr(e,6)}e+=5;c=e+1}break;case"n":if(s||n[e+2]==='"'||n.length<r){e+=1}else{a+=n.slice(c,e)+"\n\n";while(n[e+2]==="\\"&&n[e+3]==="n"&&n[e+4]!=='"'){a+="\n";e+=2}a+=o;if(n[e+2]===" ")a+="\\";e+=1;c=e+1}break;default:e+=1}}a=c?a+n.slice(c):n;return s?a:i.foldFlowLines(a,o,i.FOLD_QUOTED,getFoldOptions(t))}function singleQuotedString(e,t){if(t.options.singleQuote===false||t.implicitKey&&e.includes("\n")||/[ \t]\n|\n[ \t]/.test(e))return doubleQuotedString(e,t);const n=t.indent||(containsDocumentMarker(e)?"  ":"");const s="'"+e.replace(/'/g,"''").replace(/\n+/g,`$&\n${n}`)+"'";return t.implicitKey?s:i.foldFlowLines(s,n,i.FOLD_FLOW,getFoldOptions(t))}function quotedString(e,t){const{singleQuote:n}=t.options;let s;if(n===false)s=doubleQuotedString;else{const t=e.includes('"');const i=e.includes("'");if(t&&!i)s=singleQuotedString;else if(i&&!t)s=doubleQuotedString;else s=n?singleQuotedString:doubleQuotedString}return s(e,t)}function blockString({comment:e,type:t,value:n},r,o,a){const{blockQuote:c,commentString:l,lineWidth:f}=r.options;if(!c||/\n[\t ]+$/.test(n)||/^\s*$/.test(n)){return quotedString(n,r)}const u=r.indent||(r.forceBlockIndent||containsDocumentMarker(n)?"  ":"");const d=c==="literal"?true:c==="folded"||t===s.Scalar.BLOCK_FOLDED?false:t===s.Scalar.BLOCK_LITERAL?true:!lineLengthOverLimit(n,f,u.length);if(!n)return d?"|\n":">\n";let h;let p;for(p=n.length;p>0;--p){const e=n[p-1];if(e!=="\n"&&e!=="\t"&&e!==" ")break}let m=n.substring(p);const y=m.indexOf("\n");if(y===-1){h="-"}else if(n===m||y!==m.length-1){h="+";if(a)a()}else{h=""}if(m){n=n.slice(0,-m.length);if(m[m.length-1]==="\n")m=m.slice(0,-1);m=m.replace(/\n+(?!\n|$)/g,`$&${u}`)}let g=false;let v;let b=-1;for(v=0;v<n.length;++v){const e=n[v];if(e===" ")g=true;else if(e==="\n")b=v;else break}let S=n.substring(0,b<v?b+1:v);if(S){n=n.substring(S.length);S=S.replace(/\n+/g,`$&${u}`)}const w=u?"2":"1";let k=(d?"|":">")+(g?w:"")+h;if(e){k+=" "+l(e.replace(/ ?[\r\n]+/g," "));if(o)o()}if(d){n=n.replace(/\n+/g,`$&${u}`);return`${k}\n${u}${S}${n}${m}`}n=n.replace(/\n+/g,"\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g,"$1$2").replace(/\n+/g,`$&${u}`);const E=i.foldFlowLines(`${S}${n}${m}`,u,i.FOLD_BLOCK,getFoldOptions(r));return`${k}\n${u}${E}`}function plainString(e,t,n,r){const{type:o,value:a}=e;const{actualString:c,implicitKey:l,indent:f,inFlow:u}=t;if(l&&/[\n[\]{},]/.test(a)||u&&/[[\]{},]/.test(a)){return quotedString(a,t)}if(!a||/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a)){return l||u||!a.includes("\n")?quotedString(a,t):blockString(e,t,n,r)}if(!l&&!u&&o!==s.Scalar.PLAIN&&a.includes("\n")){return blockString(e,t,n,r)}if(f===""&&containsDocumentMarker(a)){t.forceBlockIndent=true;return blockString(e,t,n,r)}const d=a.replace(/\n+/g,`$&\n${f}`);if(c){const test=e=>e.default&&e.tag!=="tag:yaml.org,2002:str"&&e.test?.test(d);const{compat:e,tags:n}=t.doc.schema;if(n.some(test)||e?.some(test))return quotedString(a,t)}return l?d:i.foldFlowLines(d,f,i.FOLD_FLOW,getFoldOptions(t))}function stringifyString(e,t,n,i){const{implicitKey:r,inFlow:o}=t;const a=typeof e.value==="string"?e:Object.assign({},e,{value:String(e.value)});let{type:c}=e;if(c!==s.Scalar.QUOTE_DOUBLE){if(/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(a.value))c=s.Scalar.QUOTE_DOUBLE}const _stringify=e=>{switch(e){case s.Scalar.BLOCK_FOLDED:case s.Scalar.BLOCK_LITERAL:return r||o?quotedString(a.value,t):blockString(a,t,n,i);case s.Scalar.QUOTE_DOUBLE:return doubleQuotedString(a.value,t);case s.Scalar.QUOTE_SINGLE:return singleQuotedString(a.value,t);case s.Scalar.PLAIN:return plainString(a,t,n,i);default:return null}};let l=_stringify(c);if(l===null){const{defaultKeyType:e,defaultStringType:n}=t.options;const s=r&&e||n;l=_stringify(s);if(l===null)throw new Error(`Unsupported default string type ${s}`)}return l}t.stringifyString=stringifyString},6796:(e,t,n)=>{var s=n(1399);const i=Symbol("break visit");const r=Symbol("skip children");const o=Symbol("remove node");function visit(e,t){const n=initVisitor(t);if(s.isDocument(e)){const t=visit_(null,e.contents,n,Object.freeze([e]));if(t===o)e.contents=null}else visit_(null,e,n,Object.freeze([]))}visit.BREAK=i;visit.SKIP=r;visit.REMOVE=o;function visit_(e,t,n,r){const a=callVisitor(e,t,n,r);if(s.isNode(a)||s.isPair(a)){replaceNode(e,r,a);return visit_(e,a,n,r)}if(typeof a!=="symbol"){if(s.isCollection(t)){r=Object.freeze(r.concat(t));for(let e=0;e<t.items.length;++e){const s=visit_(e,t.items[e],n,r);if(typeof s==="number")e=s-1;else if(s===i)return i;else if(s===o){t.items.splice(e,1);e-=1}}}else if(s.isPair(t)){r=Object.freeze(r.concat(t));const e=visit_("key",t.key,n,r);if(e===i)return i;else if(e===o)t.key=null;const s=visit_("value",t.value,n,r);if(s===i)return i;else if(s===o)t.value=null}}return a}async function visitAsync(e,t){const n=initVisitor(t);if(s.isDocument(e)){const t=await visitAsync_(null,e.contents,n,Object.freeze([e]));if(t===o)e.contents=null}else await visitAsync_(null,e,n,Object.freeze([]))}visitAsync.BREAK=i;visitAsync.SKIP=r;visitAsync.REMOVE=o;async function visitAsync_(e,t,n,r){const a=await callVisitor(e,t,n,r);if(s.isNode(a)||s.isPair(a)){replaceNode(e,r,a);return visitAsync_(e,a,n,r)}if(typeof a!=="symbol"){if(s.isCollection(t)){r=Object.freeze(r.concat(t));for(let e=0;e<t.items.length;++e){const s=await visitAsync_(e,t.items[e],n,r);if(typeof s==="number")e=s-1;else if(s===i)return i;else if(s===o){t.items.splice(e,1);e-=1}}}else if(s.isPair(t)){r=Object.freeze(r.concat(t));const e=await visitAsync_("key",t.key,n,r);if(e===i)return i;else if(e===o)t.key=null;const s=await visitAsync_("value",t.value,n,r);if(s===i)return i;else if(s===o)t.value=null}}return a}function initVisitor(e){if(typeof e==="object"&&(e.Collection||e.Node||e.Value)){return Object.assign({Alias:e.Node,Map:e.Node,Scalar:e.Node,Seq:e.Node},e.Value&&{Map:e.Value,Scalar:e.Value,Seq:e.Value},e.Collection&&{Map:e.Collection,Seq:e.Collection},e)}return e}function callVisitor(e,t,n,i){if(typeof n==="function")return n(e,t,i);if(s.isMap(t))return n.Map?.(e,t,i);if(s.isSeq(t))return n.Seq?.(e,t,i);if(s.isPair(t))return n.Pair?.(e,t,i);if(s.isScalar(t))return n.Scalar?.(e,t,i);if(s.isAlias(t))return n.Alias?.(e,t,i);return undefined}function replaceNode(e,t,n){const i=t[t.length-1];if(s.isCollection(i)){i.items[e]=n}else if(s.isPair(i)){if(e==="key")i.key=n;else i.value=n}else if(s.isDocument(i)){i.contents=n}else{const e=s.isAlias(i)?"alias":"scalar";throw new Error(`Cannot replace node with ${e} parent`)}}t.visit=visit;t.visitAsync=visitAsync}};var t={};function __nccwpck_require2_(n){var s=t[n];if(s!==undefined){return s.exports}var i=t[n]={exports:{}};var r=true;try{e[n].call(i.exports,i,i.exports,__nccwpck_require2_);r=false}finally{if(r)delete t[n]}return i.exports}if(typeof __nccwpck_require2_!=="undefined")__nccwpck_require2_.ab=__dirname+"/";var n=__nccwpck_require2_(6144);module.exports=n})();
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8222:
/***/ ((module, exports, __nccwpck_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 6243:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __nccwpck_require__(900);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 8237:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __nccwpck_require__(8222);
} else {
	module.exports = __nccwpck_require__(4874);
}


/***/ }),

/***/ 4874:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

const tty = __nccwpck_require__(6224);
const util = __nccwpck_require__(3837);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __nccwpck_require__(132);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 9074:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const zlib = __nccwpck_require__(9796);
const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const parse = (__nccwpck_require__(7310).parse);
const format = (__nccwpck_require__(7310).format);

const debugBody = __nccwpck_require__(8237)('httpx:body');
const debugHeader = __nccwpck_require__(8237)('httpx:header');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const TIMEOUT = 3000; // 3s

const READ_TIMER = Symbol('TIMER::READ_TIMER');
const READ_TIME_OUT = Symbol('TIMER::READ_TIME_OUT');
const READ_TIMER_START_AT = Symbol('TIMER::READ_TIMER_START_AT');

var append = function (err, name, message) {
  err.name = name + err.name;
  err.message = `${message}. ${err.message}`;
  return err;
};

const isNumber = function (num) {
  return num !== null && !isNaN(num);
};

exports.request = function (url, opts) {
  // request(url)
  opts || (opts = {});

  const parsed = typeof url === 'string' ? parse(url) : url;

  let readTimeout, connectTimeout;
  if (isNumber(opts.readTimeout) || isNumber(opts.connectTimeout)) {
    readTimeout = isNumber(opts.readTimeout) ? Number(opts.readTimeout) : TIMEOUT;
    connectTimeout = isNumber(opts.connectTimeout) ? Number(opts.connectTimeout) : TIMEOUT;
  } else if (isNumber(opts.timeout)) {
    readTimeout = connectTimeout = Number(opts.timeout);
  } else {
    readTimeout = connectTimeout = TIMEOUT;
  }

  const isHttps = parsed.protocol === 'https:';
  const method = (opts.method || 'GET').toUpperCase();
  const defaultAgent = isHttps ? httpsAgent : httpAgent;
  const agent = opts.agent || defaultAgent;

  var options = {
    host: parsed.hostname || 'localhost',
    path: parsed.path || '/',
    method: method,
    port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
    agent: agent,
    headers: opts.headers || {},
    // ssl config
    key: opts.key || '',
    cert: opts.cert || '',
    ca: opts.ca || '',
    // connect timerout
    timeout: connectTimeout
  };

  if (isHttps && typeof opts.rejectUnauthorized !== 'undefined') {
    options.rejectUnauthorized = opts.rejectUnauthorized;
  }

  if (opts.compression) {
    options.headers['accept-encoding'] = 'gzip,deflate';
  }

  const httplib = isHttps ? https : http;

  if (typeof opts.beforeRequest === 'function') {
    options = opts.beforeRequest(options);
  }

  return new Promise((resolve, reject) => {
    const request = httplib.request(options);
    const body = opts.data;

    var fulfilled = (response) => {
      if (debugHeader.enabled) {
        const requestHeaders = response.req._header;
        requestHeaders.split('\r\n').forEach((line) => {
          debugHeader('> %s', line);
        });

        debugHeader('< HTTP/%s %s %s', response.httpVersion, response.statusCode, response.statusMessage);
        Object.keys(response.headers).forEach((key) => {
          debugHeader('< %s: %s', key, response.headers[key]);
        });
      }
      resolve(response);
    };

    var rejected = (err) => {
      err.message += `${method} ${format(parsed)} failed.`;
      // clear response timer when error
      if (request.socket && request.socket[READ_TIMER]) {
        clearTimeout(request.socket[READ_TIMER]);
      }
      reject(err);
    };

    var abort = (err) => {
      request.abort();
      rejected(err);
    };

    const startResponseTimer = function (socket) {
      const timer = setTimeout(() => {
        if (socket[READ_TIMER]) {
          clearTimeout(socket[READ_TIMER]);
          socket[READ_TIMER] = null;
        }
        var err = new Error();
        var message = `ReadTimeout(${readTimeout})`;
        abort(append(err, 'RequestTimeout', message));
      }, readTimeout);
      // start read-timer
      socket[READ_TIME_OUT] = readTimeout;
      socket[READ_TIMER] = timer;
      socket[READ_TIMER_START_AT] = Date.now();
    };

    // string
    if (!body || 'string' === typeof body || body instanceof Buffer) {
      if (debugBody.enabled) {
        if (!body) {
          debugBody('<no request body>');
        } else if ('string' === typeof body) {
          debugBody(body);
        } else {
          debugBody(`Buffer <ignored>, Buffer length: ${body.length}`);
        }
      }
      request.end(body);
    } else if ('function' === typeof body.pipe) { // stream
      body.pipe(request);
      if (debugBody.enabled) {
        debugBody('<request body is a stream>');
      }
      body.once('error', (err) => {
        abort(append(err, 'HttpX', 'Stream occor error'));
      });
    }

    request.on('response', fulfilled);
    request.on('error', rejected);
    request.once('socket', function (socket) {
      // reuse socket
      if (socket.readyState === 'opening') {
        socket.once('connect', function () {
          startResponseTimer(socket);
        });
      } else {
        startResponseTimer(socket);
      }
    });
  });
};

exports.read = function (response, encoding) {
  var readable = response;
  switch (response.headers['content-encoding']) {
  // or, just use zlib.createUnzip() to handle both cases
  case 'gzip':
    readable = response.pipe(zlib.createGunzip());
    break;
  case 'deflate':
    readable = response.pipe(zlib.createInflate());
    break;
  default:
    break;
  }

  return new Promise((resolve, reject) => {
    // node.js 14 use response.client
    const socket = response.socket || response.client;

    const makeReadTimeoutError = () => {
      const req = response.req;
      var err = new Error();
      err.name = 'RequestTimeoutError';
      err.message = `ReadTimeout: ${socket[READ_TIME_OUT]}. ${req.method} ${req.path} failed.`;
      return err;
    };
    // check read-timer
    let readTimer;
    const oldReadTimer = socket[READ_TIMER];
    if (!oldReadTimer) {
      reject(makeReadTimeoutError());
      return;
    }
    const remainTime = socket[READ_TIME_OUT] - (Date.now() - socket[READ_TIMER_START_AT]);
    clearTimeout(oldReadTimer);
    if (remainTime <= 0) {
      reject(makeReadTimeoutError());
      return;
    }
    readTimer = setTimeout(function () {
      reject(makeReadTimeoutError());
    }, remainTime);

    // start reading data
    var onError, onData, onEnd;
    var cleanup = function () {
      // cleanup
      readable.removeListener('error', onError);
      readable.removeListener('data', onData);
      readable.removeListener('end', onEnd);
      // clear read timer
      if (readTimer) {
        clearTimeout(readTimer);
      }
    };

    const bufs = [];
    var size = 0;

    onData = function (buf) {
      bufs.push(buf);
      size += buf.length;
    };

    onError = function (err) {
      cleanup();
      reject(err);
    };

    onEnd = function () {
      cleanup();
      var buff = Buffer.concat(bufs, size);

      debugBody('');
      if (encoding) {
        const result = buff.toString(encoding);
        debugBody(result);
        return resolve(result);
      }

      if (debugBody.enabled) {
        debugBody(buff.toString());
      }
      resolve(buff);
    };

    readable.on('error', onError);
    readable.on('data', onData);
    readable.on('end', onEnd);
  });
};


/***/ }),

/***/ 8885:
/***/ ((__unused_webpack_module, exports) => {

exports.parse = exports.decode = decode

exports.stringify = exports.encode = encode

exports.safe = safe
exports.unsafe = unsafe

var eol = typeof process !== 'undefined' &&
  process.platform === 'win32' ? '\r\n' : '\n'

function encode (obj, opt) {
  var children = []
  var out = ''

  if (typeof opt === 'string') {
    opt = {
      section: opt,
      whitespace: false,
    }
  } else {
    opt = opt || {}
    opt.whitespace = opt.whitespace === true
  }

  var separator = opt.whitespace ? ' = ' : '='

  Object.keys(obj).forEach(function (k, _, __) {
    var val = obj[k]
    if (val && Array.isArray(val)) {
      val.forEach(function (item) {
        out += safe(k + '[]') + separator + safe(item) + '\n'
      })
    } else if (val && typeof val === 'object')
      children.push(k)
    else
      out += safe(k) + separator + safe(val) + eol
  })

  if (opt.section && out.length)
    out = '[' + safe(opt.section) + ']' + eol + out

  children.forEach(function (k, _, __) {
    var nk = dotSplit(k).join('\\.')
    var section = (opt.section ? opt.section + '.' : '') + nk
    var child = encode(obj[k], {
      section: section,
      whitespace: opt.whitespace,
    })
    if (out.length && child.length)
      out += eol

    out += child
  })

  return out
}

function dotSplit (str) {
  return str.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./).map(function (part) {
      return part.replace(/\1/g, '\\.')
        .replace(/\2LITERAL\\1LITERAL\2/g, '\u0001')
    })
}

function decode (str) {
  var out = {}
  var p = out
  var section = null
  //          section     |key      = value
  var re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i
  var lines = str.split(/[\r\n]+/g)

  lines.forEach(function (line, _, __) {
    if (!line || line.match(/^\s*[;#]/))
      return
    var match = line.match(re)
    if (!match)
      return
    if (match[1] !== undefined) {
      section = unsafe(match[1])
      if (section === '__proto__') {
        // not allowed
        // keep parsing the section, but don't attach it.
        p = {}
        return
      }
      p = out[section] = out[section] || {}
      return
    }
    var key = unsafe(match[2])
    if (key === '__proto__')
      return
    var value = match[3] ? unsafe(match[4]) : true
    switch (value) {
      case 'true':
      case 'false':
      case 'null': value = JSON.parse(value)
    }

    // Convert keys with '[]' suffix to an array
    if (key.length > 2 && key.slice(-2) === '[]') {
      key = key.substring(0, key.length - 2)
      if (key === '__proto__')
        return
      if (!p[key])
        p[key] = []
      else if (!Array.isArray(p[key]))
        p[key] = [p[key]]
    }

    // safeguard against resetting a previously defined
    // array by accidentally forgetting the brackets
    if (Array.isArray(p[key]))
      p[key].push(value)
    else
      p[key] = value
  })

  // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
  // use a filter to return the keys that have to be deleted.
  Object.keys(out).filter(function (k, _, __) {
    if (!out[k] ||
      typeof out[k] !== 'object' ||
      Array.isArray(out[k]))
      return false

    // see if the parent section is also an object.
    // if so, add it to that, and mark this one for deletion
    var parts = dotSplit(k)
    var p = out
    var l = parts.pop()
    var nl = l.replace(/\\\./g, '.')
    parts.forEach(function (part, _, __) {
      if (part === '__proto__')
        return
      if (!p[part] || typeof p[part] !== 'object')
        p[part] = {}
      p = p[part]
    })
    if (p === out && nl === l)
      return false

    p[nl] = out[k]
    return true
  }).forEach(function (del, _, __) {
    delete out[del]
  })

  return out
}

function isQuoted (val) {
  return (val.charAt(0) === '"' && val.slice(-1) === '"') ||
    (val.charAt(0) === "'" && val.slice(-1) === "'")
}

function safe (val) {
  return (typeof val !== 'string' ||
    val.match(/[=\r\n]/) ||
    val.match(/^\[/) ||
    (val.length > 1 &&
     isQuoted(val)) ||
    val !== val.trim())
    ? JSON.stringify(val)
    : val.replace(/;/g, '\\;').replace(/#/g, '\\#')
}

function unsafe (val, doUnesc) {
  val = (val || '').trim()
  if (isQuoted(val)) {
    // remove the single quotes before calling JSON.parse
    if (val.charAt(0) === "'")
      val = val.substr(1, val.length - 2)

    try {
      val = JSON.parse(val)
    } catch (_) {}
  } else {
    // walk the val to find the first not-escaped ; character
    var esc = false
    var unesc = ''
    for (var i = 0, l = val.length; i < l; i++) {
      var c = val.charAt(i)
      if (esc) {
        if ('\\;#'.indexOf(c) !== -1)
          unesc += c
        else
          unesc += '\\' + c

        esc = false
      } else if (';#'.indexOf(c) !== -1)
        break
      else if (c === '\\')
        esc = true
      else
        unesc += c
    }
    if (esc)
      unesc += '\\'

    return unesc.trim()
  }
  return val
}


/***/ }),

/***/ 8683:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7147);
const os = __nccwpck_require__(2037);
const crypto = __nccwpck_require__(6113);

/**
 * Load *.json file synchronous. Don't use require('*.json')
 * to load *.json files, it will cached in process.
 * @param {String} filename absolute file path
 * @return {Object} a parsed object
 */
exports.loadJSONSync = function (filename) {
  // strip BOM
  var content = fs.readFileSync(filename, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  try {
    return JSON.parse(content);
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};

/**
 * Encoding a string to Buffer safely
 * @param {String} str string.
 * @param {String} encoding. optional.
 * @return {Buffer} encoded buffer
 */
exports.encode = function (str, encoding) {
  if (typeof str !== 'string') {
    str = '' + str;
  }

  return Buffer.from(str, encoding);
};

/**
 * Generate a haser with specfied algorithm
 * @param {String} algorithm can be md5, etc.
 * @return {Function} a haser with specfied algorithm
 */
exports.makeHasher = function (algorithm) {
  return function (data, encoding) {
    var shasum = crypto.createHash(algorithm);
    shasum.update(data);
    return shasum.digest(encoding);
  };
};

exports.createHash = exports.makeHasher;

/**
 * Get md5 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} encoding optional. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.md5 = exports.makeHasher('md5');

/**
 * Get sha1 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} key the key.
 * @param {String} encoding optionnal. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.createHmac = function (algorithm) {
  return function (data, key, encoding) {
    return crypto.createHmac(algorithm, key).update(data).digest(encoding);
  };
};

/**
 * Get sha1 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} key the key.
 * @param {String} encoding optionnal. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.sha1 = exports.createHmac('sha1');

/**
 * Get a random value in a range
 * @param {Number} min range start.
 * @param {Number} max range end.
 */
exports.random = function (min, max) {
  return Math.floor(min + Math.random() * (max - min));
};

/**
 * Generate a nonce string
 * @return {String} a nonce string.
 */
exports.makeNonce = (function () {
  var counter = 0;
  var last;
  const machine = os.hostname();
  const pid = process.pid;

  return function () {
    var val = Math.floor(Math.random() * 1000000000000);
    if (val === last) {
      counter++;
    } else {
      counter = 0;
    }

    last = val;

    var uid = `${machine}${pid}${val}${counter}`;
    return exports.md5(uid, 'hex');
  };
}());

/**
 * Pad a number as \d\d format
 * @param {Number} num a number that less than 100.
 * @return {String} if number less than 10, pad with 0,
 *  otherwise, returns string of number.
 */
exports.pad2 = function (num) {
  if (num < 10) {
    return '0' + num;
  }
  return '' + num;
};

/**
 * Pad a number as \d\d\d format
 * @param {Number} num a number that less than 1000.
 * @return {String} if number less than 100, pad with 0,
 *  otherwise, returns string of number.
 */
exports.pad3 = function (num) {
  if (num < 10) {
    return '00' + num;
  } else if (num < 100) {
    return '0' + num;
  }
  return '' + num;
};

/**
 * Return the YYYYMMDD format of a date.
 * @param {Date} date a Date object.
 * @return {String} the YYYYMMDD format.
 */
exports.getYYYYMMDD = function (date) {
  var YYYY = date.getFullYear();
  var MM = exports.pad2(date.getMonth() + 1);
  var DD = exports.pad2(date.getDate());
  return '' + YYYY + MM + DD;
};

/**
 * sleep a while.
 * @param {Number} in milliseconds
 * @return {Promise} a Promise
 */
exports.sleep = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Get the IPv4 address
 * @return {String} the IPv4 address, or empty string
 */
exports.getIPv4 = function () {
  var interfaces = os.networkInterfaces();
  var keys = Object.keys(interfaces);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var addresses = interfaces[key];
    for (var j = 0; j < addresses.length; j++) {
      var item = addresses[j];
      if (!item.internal && item.family === 'IPv4') {
        return item.address;
      }
    }
  }

  // without non-internal address
  return '';
};

/**
 * Get the Mac address
 * @return {String} the Mac address
 */
exports.getMac = function () {
  var interfaces = os.networkInterfaces();
  var keys = Object.keys(interfaces);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var addresses = interfaces[key];
    for (var j = 0; j < addresses.length; j++) {
      var item = addresses[j];
      if (!item.internal && item.family === 'IPv4') {
        return item.mac;
      }
    }
  }

  // without non-internal address
  return '00:00:00:00:00:00';
};

/**
 * Read all bytes from a readable
 * @return {Readable} the readable stream
 * @return {Promise} a Promise with all bytes
 */
exports.readAll = function (readable) {
  return new Promise((resolve, reject) => {
    var onError, onData, onEnd;
    var cleanup = function (err) {
      // cleanup
      readable.removeListener('error', onError);
      readable.removeListener('data', onData);
      readable.removeListener('end', onEnd);
    };

    var bufs = [];
    var size = 0;

    onData = function (buf) {
      bufs.push(buf);
      size += buf.length;
    };

    onError = function (err) {
      cleanup();
      reject(err);
    };

    onEnd = function () {
      cleanup();
      resolve(Buffer.concat(bufs, size));
    };

    readable.on('error', onError);
    readable.on('data', onData);
    readable.on('end', onEnd);
  });
};


/***/ }),

/***/ 900:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 2043:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

;(function (sax) { // wrapper for non-node envs
  sax.parser = function (strict, opt) { return new SAXParser(strict, opt) }
  sax.SAXParser = SAXParser
  sax.SAXStream = SAXStream
  sax.createStream = createStream

  // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
  // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
  // since that's the earliest that a buffer overrun could occur.  This way, checks are
  // as rare as required, but as often as necessary to ensure never crossing this bound.
  // Furthermore, buffers are only tested at most once per write(), so passing a very
  // large string into write() might have undesirable effects, but this is manageable by
  // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
  // edge case, result in creating at most one complete copy of the string passed in.
  // Set to Infinity to have unlimited buffers.
  sax.MAX_BUFFER_LENGTH = 64 * 1024

  var buffers = [
    'comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype',
    'procInstName', 'procInstBody', 'entity', 'attribName',
    'attribValue', 'cdata', 'script'
  ]

  sax.EVENTS = [
    'text',
    'processinginstruction',
    'sgmldeclaration',
    'doctype',
    'comment',
    'opentagstart',
    'attribute',
    'opentag',
    'closetag',
    'opencdata',
    'cdata',
    'closecdata',
    'error',
    'end',
    'ready',
    'script',
    'opennamespace',
    'closenamespace'
  ]

  function SAXParser (strict, opt) {
    if (!(this instanceof SAXParser)) {
      return new SAXParser(strict, opt)
    }

    var parser = this
    clearBuffers(parser)
    parser.q = parser.c = ''
    parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
    parser.opt = opt || {}
    parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags
    parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase'
    parser.tags = []
    parser.closed = parser.closedRoot = parser.sawRoot = false
    parser.tag = parser.error = null
    parser.strict = !!strict
    parser.noscript = !!(strict || parser.opt.noscript)
    parser.state = S.BEGIN
    parser.strictEntities = parser.opt.strictEntities
    parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES)
    parser.attribList = []

    // namespaces form a prototype chain.
    // it always points at the current tag,
    // which protos to its parent tag.
    if (parser.opt.xmlns) {
      parser.ns = Object.create(rootNS)
    }

    // mostly just for error reporting
    parser.trackPosition = parser.opt.position !== false
    if (parser.trackPosition) {
      parser.position = parser.line = parser.column = 0
    }
    emit(parser, 'onready')
  }

  if (!Object.create) {
    Object.create = function (o) {
      function F () {}
      F.prototype = o
      var newf = new F()
      return newf
    }
  }

  if (!Object.keys) {
    Object.keys = function (o) {
      var a = []
      for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
      return a
    }
  }

  function checkBufferLength (parser) {
    var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
    var maxActual = 0
    for (var i = 0, l = buffers.length; i < l; i++) {
      var len = parser[buffers[i]].length
      if (len > maxAllowed) {
        // Text/cdata nodes can get big, and since they're buffered,
        // we can get here under normal conditions.
        // Avoid issues by emitting the text node now,
        // so at least it won't get any bigger.
        switch (buffers[i]) {
          case 'textNode':
            closeText(parser)
            break

          case 'cdata':
            emitNode(parser, 'oncdata', parser.cdata)
            parser.cdata = ''
            break

          case 'script':
            emitNode(parser, 'onscript', parser.script)
            parser.script = ''
            break

          default:
            error(parser, 'Max buffer length exceeded: ' + buffers[i])
        }
      }
      maxActual = Math.max(maxActual, len)
    }
    // schedule the next check for the earliest possible buffer overrun.
    var m = sax.MAX_BUFFER_LENGTH - maxActual
    parser.bufferCheckPosition = m + parser.position
  }

  function clearBuffers (parser) {
    for (var i = 0, l = buffers.length; i < l; i++) {
      parser[buffers[i]] = ''
    }
  }

  function flushBuffers (parser) {
    closeText(parser)
    if (parser.cdata !== '') {
      emitNode(parser, 'oncdata', parser.cdata)
      parser.cdata = ''
    }
    if (parser.script !== '') {
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }
  }

  SAXParser.prototype = {
    end: function () { end(this) },
    write: write,
    resume: function () { this.error = null; return this },
    close: function () { return this.write(null) },
    flush: function () { flushBuffers(this) }
  }

  var Stream
  try {
    Stream = (__nccwpck_require__(2781).Stream)
  } catch (ex) {
    Stream = function () {}
  }

  var streamWraps = sax.EVENTS.filter(function (ev) {
    return ev !== 'error' && ev !== 'end'
  })

  function createStream (strict, opt) {
    return new SAXStream(strict, opt)
  }

  function SAXStream (strict, opt) {
    if (!(this instanceof SAXStream)) {
      return new SAXStream(strict, opt)
    }

    Stream.apply(this)

    this._parser = new SAXParser(strict, opt)
    this.writable = true
    this.readable = true

    var me = this

    this._parser.onend = function () {
      me.emit('end')
    }

    this._parser.onerror = function (er) {
      me.emit('error', er)

      // if didn't throw, then means error was handled.
      // go ahead and clear error, so we can write again.
      me._parser.error = null
    }

    this._decoder = null

    streamWraps.forEach(function (ev) {
      Object.defineProperty(me, 'on' + ev, {
        get: function () {
          return me._parser['on' + ev]
        },
        set: function (h) {
          if (!h) {
            me.removeAllListeners(ev)
            me._parser['on' + ev] = h
            return h
          }
          me.on(ev, h)
        },
        enumerable: true,
        configurable: false
      })
    })
  }

  SAXStream.prototype = Object.create(Stream.prototype, {
    constructor: {
      value: SAXStream
    }
  })

  SAXStream.prototype.write = function (data) {
    if (typeof Buffer === 'function' &&
      typeof Buffer.isBuffer === 'function' &&
      Buffer.isBuffer(data)) {
      if (!this._decoder) {
        var SD = (__nccwpck_require__(1576).StringDecoder)
        this._decoder = new SD('utf8')
      }
      data = this._decoder.write(data)
    }

    this._parser.write(data.toString())
    this.emit('data', data)
    return true
  }

  SAXStream.prototype.end = function (chunk) {
    if (chunk && chunk.length) {
      this.write(chunk)
    }
    this._parser.end()
    return true
  }

  SAXStream.prototype.on = function (ev, handler) {
    var me = this
    if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
      me._parser['on' + ev] = function () {
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
        args.splice(0, 0, ev)
        me.emit.apply(me, args)
      }
    }

    return Stream.prototype.on.call(me, ev, handler)
  }

  // this really needs to be replaced with character classes.
  // XML allows all manner of ridiculous numbers and digits.
  var CDATA = '[CDATA['
  var DOCTYPE = 'DOCTYPE'
  var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
  var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/'
  var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE }

  // http://www.w3.org/TR/REC-xml/#NT-NameStartChar
  // This implementation works on strings, a single character at a time
  // as such, it cannot ever support astral-plane characters (10000-EFFFF)
  // without a significant breaking change to either this  parser, or the
  // JavaScript language.  Implementation of an emoji-capable xml parser
  // is left as an exercise for the reader.
  var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/

  var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/
  var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  function isWhitespace (c) {
    return c === ' ' || c === '\n' || c === '\r' || c === '\t'
  }

  function isQuote (c) {
    return c === '"' || c === '\''
  }

  function isAttribEnd (c) {
    return c === '>' || isWhitespace(c)
  }

  function isMatch (regex, c) {
    return regex.test(c)
  }

  function notMatch (regex, c) {
    return !isMatch(regex, c)
  }

  var S = 0
  sax.STATE = {
    BEGIN: S++, // leading byte order mark or whitespace
    BEGIN_WHITESPACE: S++, // leading whitespace
    TEXT: S++, // general stuff
    TEXT_ENTITY: S++, // &amp and such.
    OPEN_WAKA: S++, // <
    SGML_DECL: S++, // <!BLARG
    SGML_DECL_QUOTED: S++, // <!BLARG foo "bar
    DOCTYPE: S++, // <!DOCTYPE
    DOCTYPE_QUOTED: S++, // <!DOCTYPE "//blah
    DOCTYPE_DTD: S++, // <!DOCTYPE "//blah" [ ...
    DOCTYPE_DTD_QUOTED: S++, // <!DOCTYPE "//blah" [ "foo
    COMMENT_STARTING: S++, // <!-
    COMMENT: S++, // <!--
    COMMENT_ENDING: S++, // <!-- blah -
    COMMENT_ENDED: S++, // <!-- blah --
    CDATA: S++, // <![CDATA[ something
    CDATA_ENDING: S++, // ]
    CDATA_ENDING_2: S++, // ]]
    PROC_INST: S++, // <?hi
    PROC_INST_BODY: S++, // <?hi there
    PROC_INST_ENDING: S++, // <?hi "there" ?
    OPEN_TAG: S++, // <strong
    OPEN_TAG_SLASH: S++, // <strong /
    ATTRIB: S++, // <a
    ATTRIB_NAME: S++, // <a foo
    ATTRIB_NAME_SAW_WHITE: S++, // <a foo _
    ATTRIB_VALUE: S++, // <a foo=
    ATTRIB_VALUE_QUOTED: S++, // <a foo="bar
    ATTRIB_VALUE_CLOSED: S++, // <a foo="bar"
    ATTRIB_VALUE_UNQUOTED: S++, // <a foo=bar
    ATTRIB_VALUE_ENTITY_Q: S++, // <foo bar="&quot;"
    ATTRIB_VALUE_ENTITY_U: S++, // <foo bar=&quot
    CLOSE_TAG: S++, // </a
    CLOSE_TAG_SAW_WHITE: S++, // </a   >
    SCRIPT: S++, // <script> ...
    SCRIPT_ENDING: S++ // <script> ... <
  }

  sax.XML_ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'"
  }

  sax.ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'",
    'AElig': 198,
    'Aacute': 193,
    'Acirc': 194,
    'Agrave': 192,
    'Aring': 197,
    'Atilde': 195,
    'Auml': 196,
    'Ccedil': 199,
    'ETH': 208,
    'Eacute': 201,
    'Ecirc': 202,
    'Egrave': 200,
    'Euml': 203,
    'Iacute': 205,
    'Icirc': 206,
    'Igrave': 204,
    'Iuml': 207,
    'Ntilde': 209,
    'Oacute': 211,
    'Ocirc': 212,
    'Ograve': 210,
    'Oslash': 216,
    'Otilde': 213,
    'Ouml': 214,
    'THORN': 222,
    'Uacute': 218,
    'Ucirc': 219,
    'Ugrave': 217,
    'Uuml': 220,
    'Yacute': 221,
    'aacute': 225,
    'acirc': 226,
    'aelig': 230,
    'agrave': 224,
    'aring': 229,
    'atilde': 227,
    'auml': 228,
    'ccedil': 231,
    'eacute': 233,
    'ecirc': 234,
    'egrave': 232,
    'eth': 240,
    'euml': 235,
    'iacute': 237,
    'icirc': 238,
    'igrave': 236,
    'iuml': 239,
    'ntilde': 241,
    'oacute': 243,
    'ocirc': 244,
    'ograve': 242,
    'oslash': 248,
    'otilde': 245,
    'ouml': 246,
    'szlig': 223,
    'thorn': 254,
    'uacute': 250,
    'ucirc': 251,
    'ugrave': 249,
    'uuml': 252,
    'yacute': 253,
    'yuml': 255,
    'copy': 169,
    'reg': 174,
    'nbsp': 160,
    'iexcl': 161,
    'cent': 162,
    'pound': 163,
    'curren': 164,
    'yen': 165,
    'brvbar': 166,
    'sect': 167,
    'uml': 168,
    'ordf': 170,
    'laquo': 171,
    'not': 172,
    'shy': 173,
    'macr': 175,
    'deg': 176,
    'plusmn': 177,
    'sup1': 185,
    'sup2': 178,
    'sup3': 179,
    'acute': 180,
    'micro': 181,
    'para': 182,
    'middot': 183,
    'cedil': 184,
    'ordm': 186,
    'raquo': 187,
    'frac14': 188,
    'frac12': 189,
    'frac34': 190,
    'iquest': 191,
    'times': 215,
    'divide': 247,
    'OElig': 338,
    'oelig': 339,
    'Scaron': 352,
    'scaron': 353,
    'Yuml': 376,
    'fnof': 402,
    'circ': 710,
    'tilde': 732,
    'Alpha': 913,
    'Beta': 914,
    'Gamma': 915,
    'Delta': 916,
    'Epsilon': 917,
    'Zeta': 918,
    'Eta': 919,
    'Theta': 920,
    'Iota': 921,
    'Kappa': 922,
    'Lambda': 923,
    'Mu': 924,
    'Nu': 925,
    'Xi': 926,
    'Omicron': 927,
    'Pi': 928,
    'Rho': 929,
    'Sigma': 931,
    'Tau': 932,
    'Upsilon': 933,
    'Phi': 934,
    'Chi': 935,
    'Psi': 936,
    'Omega': 937,
    'alpha': 945,
    'beta': 946,
    'gamma': 947,
    'delta': 948,
    'epsilon': 949,
    'zeta': 950,
    'eta': 951,
    'theta': 952,
    'iota': 953,
    'kappa': 954,
    'lambda': 955,
    'mu': 956,
    'nu': 957,
    'xi': 958,
    'omicron': 959,
    'pi': 960,
    'rho': 961,
    'sigmaf': 962,
    'sigma': 963,
    'tau': 964,
    'upsilon': 965,
    'phi': 966,
    'chi': 967,
    'psi': 968,
    'omega': 969,
    'thetasym': 977,
    'upsih': 978,
    'piv': 982,
    'ensp': 8194,
    'emsp': 8195,
    'thinsp': 8201,
    'zwnj': 8204,
    'zwj': 8205,
    'lrm': 8206,
    'rlm': 8207,
    'ndash': 8211,
    'mdash': 8212,
    'lsquo': 8216,
    'rsquo': 8217,
    'sbquo': 8218,
    'ldquo': 8220,
    'rdquo': 8221,
    'bdquo': 8222,
    'dagger': 8224,
    'Dagger': 8225,
    'bull': 8226,
    'hellip': 8230,
    'permil': 8240,
    'prime': 8242,
    'Prime': 8243,
    'lsaquo': 8249,
    'rsaquo': 8250,
    'oline': 8254,
    'frasl': 8260,
    'euro': 8364,
    'image': 8465,
    'weierp': 8472,
    'real': 8476,
    'trade': 8482,
    'alefsym': 8501,
    'larr': 8592,
    'uarr': 8593,
    'rarr': 8594,
    'darr': 8595,
    'harr': 8596,
    'crarr': 8629,
    'lArr': 8656,
    'uArr': 8657,
    'rArr': 8658,
    'dArr': 8659,
    'hArr': 8660,
    'forall': 8704,
    'part': 8706,
    'exist': 8707,
    'empty': 8709,
    'nabla': 8711,
    'isin': 8712,
    'notin': 8713,
    'ni': 8715,
    'prod': 8719,
    'sum': 8721,
    'minus': 8722,
    'lowast': 8727,
    'radic': 8730,
    'prop': 8733,
    'infin': 8734,
    'ang': 8736,
    'and': 8743,
    'or': 8744,
    'cap': 8745,
    'cup': 8746,
    'int': 8747,
    'there4': 8756,
    'sim': 8764,
    'cong': 8773,
    'asymp': 8776,
    'ne': 8800,
    'equiv': 8801,
    'le': 8804,
    'ge': 8805,
    'sub': 8834,
    'sup': 8835,
    'nsub': 8836,
    'sube': 8838,
    'supe': 8839,
    'oplus': 8853,
    'otimes': 8855,
    'perp': 8869,
    'sdot': 8901,
    'lceil': 8968,
    'rceil': 8969,
    'lfloor': 8970,
    'rfloor': 8971,
    'lang': 9001,
    'rang': 9002,
    'loz': 9674,
    'spades': 9824,
    'clubs': 9827,
    'hearts': 9829,
    'diams': 9830
  }

  Object.keys(sax.ENTITIES).forEach(function (key) {
    var e = sax.ENTITIES[key]
    var s = typeof e === 'number' ? String.fromCharCode(e) : e
    sax.ENTITIES[key] = s
  })

  for (var s in sax.STATE) {
    sax.STATE[sax.STATE[s]] = s
  }

  // shorthand
  S = sax.STATE

  function emit (parser, event, data) {
    parser[event] && parser[event](data)
  }

  function emitNode (parser, nodeType, data) {
    if (parser.textNode) closeText(parser)
    emit(parser, nodeType, data)
  }

  function closeText (parser) {
    parser.textNode = textopts(parser.opt, parser.textNode)
    if (parser.textNode) emit(parser, 'ontext', parser.textNode)
    parser.textNode = ''
  }

  function textopts (opt, text) {
    if (opt.trim) text = text.trim()
    if (opt.normalize) text = text.replace(/\s+/g, ' ')
    return text
  }

  function error (parser, er) {
    closeText(parser)
    if (parser.trackPosition) {
      er += '\nLine: ' + parser.line +
        '\nColumn: ' + parser.column +
        '\nChar: ' + parser.c
    }
    er = new Error(er)
    parser.error = er
    emit(parser, 'onerror', er)
    return parser
  }

  function end (parser) {
    if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag')
    if ((parser.state !== S.BEGIN) &&
      (parser.state !== S.BEGIN_WHITESPACE) &&
      (parser.state !== S.TEXT)) {
      error(parser, 'Unexpected end')
    }
    closeText(parser)
    parser.c = ''
    parser.closed = true
    emit(parser, 'onend')
    SAXParser.call(parser, parser.strict, parser.opt)
    return parser
  }

  function strictFail (parser, message) {
    if (typeof parser !== 'object' || !(parser instanceof SAXParser)) {
      throw new Error('bad call to strictFail')
    }
    if (parser.strict) {
      error(parser, message)
    }
  }

  function newTag (parser) {
    if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]()
    var parent = parser.tags[parser.tags.length - 1] || parser
    var tag = parser.tag = { name: parser.tagName, attributes: {} }

    // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
    if (parser.opt.xmlns) {
      tag.ns = parent.ns
    }
    parser.attribList.length = 0
    emitNode(parser, 'onopentagstart', tag)
  }

  function qname (name, attribute) {
    var i = name.indexOf(':')
    var qualName = i < 0 ? [ '', name ] : name.split(':')
    var prefix = qualName[0]
    var local = qualName[1]

    // <x "xmlns"="http://foo">
    if (attribute && name === 'xmlns') {
      prefix = 'xmlns'
      local = ''
    }

    return { prefix: prefix, local: local }
  }

  function attrib (parser) {
    if (!parser.strict) {
      parser.attribName = parser.attribName[parser.looseCase]()
    }

    if (parser.attribList.indexOf(parser.attribName) !== -1 ||
      parser.tag.attributes.hasOwnProperty(parser.attribName)) {
      parser.attribName = parser.attribValue = ''
      return
    }

    if (parser.opt.xmlns) {
      var qn = qname(parser.attribName, true)
      var prefix = qn.prefix
      var local = qn.local

      if (prefix === 'xmlns') {
        // namespace binding attribute. push the binding into scope
        if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
          strictFail(parser,
            'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
          strictFail(parser,
            'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else {
          var tag = parser.tag
          var parent = parser.tags[parser.tags.length - 1] || parser
          if (tag.ns === parent.ns) {
            tag.ns = Object.create(parent.ns)
          }
          tag.ns[local] = parser.attribValue
        }
      }

      // defer onattribute events until all attributes have been seen
      // so any new bindings can take effect. preserve attribute order
      // so deferred events can be emitted in document order
      parser.attribList.push([parser.attribName, parser.attribValue])
    } else {
      // in non-xmlns mode, we can emit the event right away
      parser.tag.attributes[parser.attribName] = parser.attribValue
      emitNode(parser, 'onattribute', {
        name: parser.attribName,
        value: parser.attribValue
      })
    }

    parser.attribName = parser.attribValue = ''
  }

  function openTag (parser, selfClosing) {
    if (parser.opt.xmlns) {
      // emit namespace binding events
      var tag = parser.tag

      // add namespace info to tag
      var qn = qname(parser.tagName)
      tag.prefix = qn.prefix
      tag.local = qn.local
      tag.uri = tag.ns[qn.prefix] || ''

      if (tag.prefix && !tag.uri) {
        strictFail(parser, 'Unbound namespace prefix: ' +
          JSON.stringify(parser.tagName))
        tag.uri = qn.prefix
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (tag.ns && parent.ns !== tag.ns) {
        Object.keys(tag.ns).forEach(function (p) {
          emitNode(parser, 'onopennamespace', {
            prefix: p,
            uri: tag.ns[p]
          })
        })
      }

      // handle deferred onattribute events
      // Note: do not apply default ns to attributes:
      //   http://www.w3.org/TR/REC-xml-names/#defaulting
      for (var i = 0, l = parser.attribList.length; i < l; i++) {
        var nv = parser.attribList[i]
        var name = nv[0]
        var value = nv[1]
        var qualName = qname(name, true)
        var prefix = qualName.prefix
        var local = qualName.local
        var uri = prefix === '' ? '' : (tag.ns[prefix] || '')
        var a = {
          name: name,
          value: value,
          prefix: prefix,
          local: local,
          uri: uri
        }

        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (prefix && prefix !== 'xmlns' && !uri) {
          strictFail(parser, 'Unbound namespace prefix: ' +
            JSON.stringify(prefix))
          a.uri = prefix
        }
        parser.tag.attributes[name] = a
        emitNode(parser, 'onattribute', a)
      }
      parser.attribList.length = 0
    }

    parser.tag.isSelfClosing = !!selfClosing

    // process the tag
    parser.sawRoot = true
    parser.tags.push(parser.tag)
    emitNode(parser, 'onopentag', parser.tag)
    if (!selfClosing) {
      // special case for <script> in non-strict mode.
      if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
        parser.state = S.SCRIPT
      } else {
        parser.state = S.TEXT
      }
      parser.tag = null
      parser.tagName = ''
    }
    parser.attribName = parser.attribValue = ''
    parser.attribList.length = 0
  }

  function closeTag (parser) {
    if (!parser.tagName) {
      strictFail(parser, 'Weird empty close tag.')
      parser.textNode += '</>'
      parser.state = S.TEXT
      return
    }

    if (parser.script) {
      if (parser.tagName !== 'script') {
        parser.script += '</' + parser.tagName + '>'
        parser.tagName = ''
        parser.state = S.SCRIPT
        return
      }
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }

    // first make sure that the closing tag actually exists.
    // <a><b></c></b></a> will close everything, otherwise.
    var t = parser.tags.length
    var tagName = parser.tagName
    if (!parser.strict) {
      tagName = tagName[parser.looseCase]()
    }
    var closeTo = tagName
    while (t--) {
      var close = parser.tags[t]
      if (close.name !== closeTo) {
        // fail the first time in strict mode
        strictFail(parser, 'Unexpected close tag')
      } else {
        break
      }
    }

    // didn't find it.  we already failed for strict, so just abort.
    if (t < 0) {
      strictFail(parser, 'Unmatched closing tag: ' + parser.tagName)
      parser.textNode += '</' + parser.tagName + '>'
      parser.state = S.TEXT
      return
    }
    parser.tagName = tagName
    var s = parser.tags.length
    while (s-- > t) {
      var tag = parser.tag = parser.tags.pop()
      parser.tagName = parser.tag.name
      emitNode(parser, 'onclosetag', parser.tagName)

      var x = {}
      for (var i in tag.ns) {
        x[i] = tag.ns[i]
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (parser.opt.xmlns && tag.ns !== parent.ns) {
        // remove namespace bindings introduced by tag
        Object.keys(tag.ns).forEach(function (p) {
          var n = tag.ns[p]
          emitNode(parser, 'onclosenamespace', { prefix: p, uri: n })
        })
      }
    }
    if (t === 0) parser.closedRoot = true
    parser.tagName = parser.attribValue = parser.attribName = ''
    parser.attribList.length = 0
    parser.state = S.TEXT
  }

  function parseEntity (parser) {
    var entity = parser.entity
    var entityLC = entity.toLowerCase()
    var num
    var numStr = ''

    if (parser.ENTITIES[entity]) {
      return parser.ENTITIES[entity]
    }
    if (parser.ENTITIES[entityLC]) {
      return parser.ENTITIES[entityLC]
    }
    entity = entityLC
    if (entity.charAt(0) === '#') {
      if (entity.charAt(1) === 'x') {
        entity = entity.slice(2)
        num = parseInt(entity, 16)
        numStr = num.toString(16)
      } else {
        entity = entity.slice(1)
        num = parseInt(entity, 10)
        numStr = num.toString(10)
      }
    }
    entity = entity.replace(/^0+/, '')
    if (isNaN(num) || numStr.toLowerCase() !== entity) {
      strictFail(parser, 'Invalid character entity')
      return '&' + parser.entity + ';'
    }

    return String.fromCodePoint(num)
  }

  function beginWhiteSpace (parser, c) {
    if (c === '<') {
      parser.state = S.OPEN_WAKA
      parser.startTagPosition = parser.position
    } else if (!isWhitespace(c)) {
      // have to process this as a text node.
      // weird, but happens.
      strictFail(parser, 'Non-whitespace before first tag.')
      parser.textNode = c
      parser.state = S.TEXT
    }
  }

  function charAt (chunk, i) {
    var result = ''
    if (i < chunk.length) {
      result = chunk.charAt(i)
    }
    return result
  }

  function write (chunk) {
    var parser = this
    if (this.error) {
      throw this.error
    }
    if (parser.closed) {
      return error(parser,
        'Cannot write after close. Assign an onready handler.')
    }
    if (chunk === null) {
      return end(parser)
    }
    if (typeof chunk === 'object') {
      chunk = chunk.toString()
    }
    var i = 0
    var c = ''
    while (true) {
      c = charAt(chunk, i++)
      parser.c = c

      if (!c) {
        break
      }

      if (parser.trackPosition) {
        parser.position++
        if (c === '\n') {
          parser.line++
          parser.column = 0
        } else {
          parser.column++
        }
      }

      switch (parser.state) {
        case S.BEGIN:
          parser.state = S.BEGIN_WHITESPACE
          if (c === '\uFEFF') {
            continue
          }
          beginWhiteSpace(parser, c)
          continue

        case S.BEGIN_WHITESPACE:
          beginWhiteSpace(parser, c)
          continue

        case S.TEXT:
          if (parser.sawRoot && !parser.closedRoot) {
            var starti = i - 1
            while (c && c !== '<' && c !== '&') {
              c = charAt(chunk, i++)
              if (c && parser.trackPosition) {
                parser.position++
                if (c === '\n') {
                  parser.line++
                  parser.column = 0
                } else {
                  parser.column++
                }
              }
            }
            parser.textNode += chunk.substring(starti, i - 1)
          }
          if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
            parser.state = S.OPEN_WAKA
            parser.startTagPosition = parser.position
          } else {
            if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
              strictFail(parser, 'Text data outside of root node.')
            }
            if (c === '&') {
              parser.state = S.TEXT_ENTITY
            } else {
              parser.textNode += c
            }
          }
          continue

        case S.SCRIPT:
          // only non-strict
          if (c === '<') {
            parser.state = S.SCRIPT_ENDING
          } else {
            parser.script += c
          }
          continue

        case S.SCRIPT_ENDING:
          if (c === '/') {
            parser.state = S.CLOSE_TAG
          } else {
            parser.script += '<' + c
            parser.state = S.SCRIPT
          }
          continue

        case S.OPEN_WAKA:
          // either a /, ?, !, or text is coming next.
          if (c === '!') {
            parser.state = S.SGML_DECL
            parser.sgmlDecl = ''
          } else if (isWhitespace(c)) {
            // wait for it...
          } else if (isMatch(nameStart, c)) {
            parser.state = S.OPEN_TAG
            parser.tagName = c
          } else if (c === '/') {
            parser.state = S.CLOSE_TAG
            parser.tagName = ''
          } else if (c === '?') {
            parser.state = S.PROC_INST
            parser.procInstName = parser.procInstBody = ''
          } else {
            strictFail(parser, 'Unencoded <')
            // if there was some whitespace, then add that in.
            if (parser.startTagPosition + 1 < parser.position) {
              var pad = parser.position - parser.startTagPosition
              c = new Array(pad).join(' ') + c
            }
            parser.textNode += '<' + c
            parser.state = S.TEXT
          }
          continue

        case S.SGML_DECL:
          if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
            emitNode(parser, 'onopencdata')
            parser.state = S.CDATA
            parser.sgmlDecl = ''
            parser.cdata = ''
          } else if (parser.sgmlDecl + c === '--') {
            parser.state = S.COMMENT
            parser.comment = ''
            parser.sgmlDecl = ''
          } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
            parser.state = S.DOCTYPE
            if (parser.doctype || parser.sawRoot) {
              strictFail(parser,
                'Inappropriately located doctype declaration')
            }
            parser.doctype = ''
            parser.sgmlDecl = ''
          } else if (c === '>') {
            emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl)
            parser.sgmlDecl = ''
            parser.state = S.TEXT
          } else if (isQuote(c)) {
            parser.state = S.SGML_DECL_QUOTED
            parser.sgmlDecl += c
          } else {
            parser.sgmlDecl += c
          }
          continue

        case S.SGML_DECL_QUOTED:
          if (c === parser.q) {
            parser.state = S.SGML_DECL
            parser.q = ''
          }
          parser.sgmlDecl += c
          continue

        case S.DOCTYPE:
          if (c === '>') {
            parser.state = S.TEXT
            emitNode(parser, 'ondoctype', parser.doctype)
            parser.doctype = true // just remember that we saw it.
          } else {
            parser.doctype += c
            if (c === '[') {
              parser.state = S.DOCTYPE_DTD
            } else if (isQuote(c)) {
              parser.state = S.DOCTYPE_QUOTED
              parser.q = c
            }
          }
          continue

        case S.DOCTYPE_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.q = ''
            parser.state = S.DOCTYPE
          }
          continue

        case S.DOCTYPE_DTD:
          parser.doctype += c
          if (c === ']') {
            parser.state = S.DOCTYPE
          } else if (isQuote(c)) {
            parser.state = S.DOCTYPE_DTD_QUOTED
            parser.q = c
          }
          continue

        case S.DOCTYPE_DTD_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.state = S.DOCTYPE_DTD
            parser.q = ''
          }
          continue

        case S.COMMENT:
          if (c === '-') {
            parser.state = S.COMMENT_ENDING
          } else {
            parser.comment += c
          }
          continue

        case S.COMMENT_ENDING:
          if (c === '-') {
            parser.state = S.COMMENT_ENDED
            parser.comment = textopts(parser.opt, parser.comment)
            if (parser.comment) {
              emitNode(parser, 'oncomment', parser.comment)
            }
            parser.comment = ''
          } else {
            parser.comment += '-' + c
            parser.state = S.COMMENT
          }
          continue

        case S.COMMENT_ENDED:
          if (c !== '>') {
            strictFail(parser, 'Malformed comment')
            // allow <!-- blah -- bloo --> in non-strict mode,
            // which is a comment of " blah -- bloo "
            parser.comment += '--' + c
            parser.state = S.COMMENT
          } else {
            parser.state = S.TEXT
          }
          continue

        case S.CDATA:
          if (c === ']') {
            parser.state = S.CDATA_ENDING
          } else {
            parser.cdata += c
          }
          continue

        case S.CDATA_ENDING:
          if (c === ']') {
            parser.state = S.CDATA_ENDING_2
          } else {
            parser.cdata += ']' + c
            parser.state = S.CDATA
          }
          continue

        case S.CDATA_ENDING_2:
          if (c === '>') {
            if (parser.cdata) {
              emitNode(parser, 'oncdata', parser.cdata)
            }
            emitNode(parser, 'onclosecdata')
            parser.cdata = ''
            parser.state = S.TEXT
          } else if (c === ']') {
            parser.cdata += ']'
          } else {
            parser.cdata += ']]' + c
            parser.state = S.CDATA
          }
          continue

        case S.PROC_INST:
          if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else if (isWhitespace(c)) {
            parser.state = S.PROC_INST_BODY
          } else {
            parser.procInstName += c
          }
          continue

        case S.PROC_INST_BODY:
          if (!parser.procInstBody && isWhitespace(c)) {
            continue
          } else if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else {
            parser.procInstBody += c
          }
          continue

        case S.PROC_INST_ENDING:
          if (c === '>') {
            emitNode(parser, 'onprocessinginstruction', {
              name: parser.procInstName,
              body: parser.procInstBody
            })
            parser.procInstName = parser.procInstBody = ''
            parser.state = S.TEXT
          } else {
            parser.procInstBody += '?' + c
            parser.state = S.PROC_INST_BODY
          }
          continue

        case S.OPEN_TAG:
          if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else {
            newTag(parser)
            if (c === '>') {
              openTag(parser)
            } else if (c === '/') {
              parser.state = S.OPEN_TAG_SLASH
            } else {
              if (!isWhitespace(c)) {
                strictFail(parser, 'Invalid character in tag name')
              }
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.OPEN_TAG_SLASH:
          if (c === '>') {
            openTag(parser, true)
            closeTag(parser)
          } else {
            strictFail(parser, 'Forward-slash in opening tag not followed by >')
            parser.state = S.ATTRIB
          }
          continue

        case S.ATTRIB:
          // haven't read the attribute name yet.
          if (isWhitespace(c)) {
            continue
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (c === '>') {
            strictFail(parser, 'Attribute without value')
            parser.attribValue = parser.attribName
            attrib(parser)
            openTag(parser)
          } else if (isWhitespace(c)) {
            parser.state = S.ATTRIB_NAME_SAW_WHITE
          } else if (isMatch(nameBody, c)) {
            parser.attribName += c
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME_SAW_WHITE:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (isWhitespace(c)) {
            continue
          } else {
            strictFail(parser, 'Attribute without value')
            parser.tag.attributes[parser.attribName] = ''
            parser.attribValue = ''
            emitNode(parser, 'onattribute', {
              name: parser.attribName,
              value: ''
            })
            parser.attribName = ''
            if (c === '>') {
              openTag(parser)
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c
              parser.state = S.ATTRIB_NAME
            } else {
              strictFail(parser, 'Invalid attribute name')
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.ATTRIB_VALUE:
          if (isWhitespace(c)) {
            continue
          } else if (isQuote(c)) {
            parser.q = c
            parser.state = S.ATTRIB_VALUE_QUOTED
          } else {
            strictFail(parser, 'Unquoted attribute value')
            parser.state = S.ATTRIB_VALUE_UNQUOTED
            parser.attribValue = c
          }
          continue

        case S.ATTRIB_VALUE_QUOTED:
          if (c !== parser.q) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_Q
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          parser.q = ''
          parser.state = S.ATTRIB_VALUE_CLOSED
          continue

        case S.ATTRIB_VALUE_CLOSED:
          if (isWhitespace(c)) {
            parser.state = S.ATTRIB
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            strictFail(parser, 'No whitespace between attributes')
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_VALUE_UNQUOTED:
          if (!isAttribEnd(c)) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_U
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          if (c === '>') {
            openTag(parser)
          } else {
            parser.state = S.ATTRIB
          }
          continue

        case S.CLOSE_TAG:
          if (!parser.tagName) {
            if (isWhitespace(c)) {
              continue
            } else if (notMatch(nameStart, c)) {
              if (parser.script) {
                parser.script += '</' + c
                parser.state = S.SCRIPT
              } else {
                strictFail(parser, 'Invalid tagname in closing tag.')
              }
            } else {
              parser.tagName = c
            }
          } else if (c === '>') {
            closeTag(parser)
          } else if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else if (parser.script) {
            parser.script += '</' + parser.tagName
            parser.tagName = ''
            parser.state = S.SCRIPT
          } else {
            if (!isWhitespace(c)) {
              strictFail(parser, 'Invalid tagname in closing tag')
            }
            parser.state = S.CLOSE_TAG_SAW_WHITE
          }
          continue

        case S.CLOSE_TAG_SAW_WHITE:
          if (isWhitespace(c)) {
            continue
          }
          if (c === '>') {
            closeTag(parser)
          } else {
            strictFail(parser, 'Invalid characters in closing tag')
          }
          continue

        case S.TEXT_ENTITY:
        case S.ATTRIB_VALUE_ENTITY_Q:
        case S.ATTRIB_VALUE_ENTITY_U:
          var returnState
          var buffer
          switch (parser.state) {
            case S.TEXT_ENTITY:
              returnState = S.TEXT
              buffer = 'textNode'
              break

            case S.ATTRIB_VALUE_ENTITY_Q:
              returnState = S.ATTRIB_VALUE_QUOTED
              buffer = 'attribValue'
              break

            case S.ATTRIB_VALUE_ENTITY_U:
              returnState = S.ATTRIB_VALUE_UNQUOTED
              buffer = 'attribValue'
              break
          }

          if (c === ';') {
            parser[buffer] += parseEntity(parser)
            parser.entity = ''
            parser.state = returnState
          } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
            parser.entity += c
          } else {
            strictFail(parser, 'Invalid character in entity name')
            parser[buffer] += '&' + parser.entity + c
            parser.entity = ''
            parser.state = returnState
          }

          continue

        default:
          throw new Error(parser, 'Unknown state: ' + parser.state)
      }
    } // while

    if (parser.position >= parser.bufferCheckPosition) {
      checkBufferLength(parser)
    }
    return parser
  }

  /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
  /* istanbul ignore next */
  if (!String.fromCodePoint) {
    (function () {
      var stringFromCharCode = String.fromCharCode
      var floor = Math.floor
      var fromCodePoint = function () {
        var MAX_SIZE = 0x4000
        var codeUnits = []
        var highSurrogate
        var lowSurrogate
        var index = -1
        var length = arguments.length
        if (!length) {
          return ''
        }
        var result = ''
        while (++index < length) {
          var codePoint = Number(arguments[index])
          if (
            !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 0x10FFFF || // not a valid Unicode code point
            floor(codePoint) !== codePoint // not an integer
          ) {
            throw RangeError('Invalid code point: ' + codePoint)
          }
          if (codePoint <= 0xFFFF) { // BMP code point
            codeUnits.push(codePoint)
          } else { // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000
            highSurrogate = (codePoint >> 10) + 0xD800
            lowSurrogate = (codePoint % 0x400) + 0xDC00
            codeUnits.push(highSurrogate, lowSurrogate)
          }
          if (index + 1 === length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits)
            codeUnits.length = 0
          }
        }
        return result
      }
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(String, 'fromCodePoint', {
          value: fromCodePoint,
          configurable: true,
          writable: true
        })
      } else {
        String.fromCodePoint = fromCodePoint
      }
    }())
  }
})( false ? 0 : exports)


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 2624:
/***/ (function(__unused_webpack_module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  exports.stripBOM = function(str) {
    if (str[0] === '\uFEFF') {
      return str.substring(1);
    } else {
      return str;
    }
  };

}).call(this);


/***/ }),

/***/ 3337:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA,
    hasProp = {}.hasOwnProperty;

  builder = __nccwpck_require__(2958);

  defaults = (__nccwpck_require__(7251).defaults);

  requiresCDATA = function(entry) {
    return typeof entry === "string" && (entry.indexOf('&') >= 0 || entry.indexOf('>') >= 0 || entry.indexOf('<') >= 0);
  };

  wrapCDATA = function(entry) {
    return "<![CDATA[" + (escapeCDATA(entry)) + "]]>";
  };

  escapeCDATA = function(entry) {
    return entry.replace(']]>', ']]]]><![CDATA[>');
  };

  exports.Builder = (function() {
    function Builder(opts) {
      var key, ref, value;
      this.options = {};
      ref = defaults["0.2"];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this.options[key] = value;
      }
      for (key in opts) {
        if (!hasProp.call(opts, key)) continue;
        value = opts[key];
        this.options[key] = value;
      }
    }

    Builder.prototype.buildObject = function(rootObj) {
      var attrkey, charkey, render, rootElement, rootName;
      attrkey = this.options.attrkey;
      charkey = this.options.charkey;
      if ((Object.keys(rootObj).length === 1) && (this.options.rootName === defaults['0.2'].rootName)) {
        rootName = Object.keys(rootObj)[0];
        rootObj = rootObj[rootName];
      } else {
        rootName = this.options.rootName;
      }
      render = (function(_this) {
        return function(element, obj) {
          var attr, child, entry, index, key, value;
          if (typeof obj !== 'object') {
            if (_this.options.cdata && requiresCDATA(obj)) {
              element.raw(wrapCDATA(obj));
            } else {
              element.txt(obj);
            }
          } else if (Array.isArray(obj)) {
            for (index in obj) {
              if (!hasProp.call(obj, index)) continue;
              child = obj[index];
              for (key in child) {
                entry = child[key];
                element = render(element.ele(key), entry).up();
              }
            }
          } else {
            for (key in obj) {
              if (!hasProp.call(obj, key)) continue;
              child = obj[key];
              if (key === attrkey) {
                if (typeof child === "object") {
                  for (attr in child) {
                    value = child[attr];
                    element = element.att(attr, value);
                  }
                }
              } else if (key === charkey) {
                if (_this.options.cdata && requiresCDATA(child)) {
                  element = element.raw(wrapCDATA(child));
                } else {
                  element = element.txt(child);
                }
              } else if (Array.isArray(child)) {
                for (index in child) {
                  if (!hasProp.call(child, index)) continue;
                  entry = child[index];
                  if (typeof entry === 'string') {
                    if (_this.options.cdata && requiresCDATA(entry)) {
                      element = element.ele(key).raw(wrapCDATA(entry)).up();
                    } else {
                      element = element.ele(key, entry).up();
                    }
                  } else {
                    element = render(element.ele(key), entry).up();
                  }
                }
              } else if (typeof child === "object") {
                element = render(element.ele(key), child).up();
              } else {
                if (typeof child === 'string' && _this.options.cdata && requiresCDATA(child)) {
                  element = element.ele(key).raw(wrapCDATA(child)).up();
                } else {
                  if (child == null) {
                    child = '';
                  }
                  element = element.ele(key, child.toString()).up();
                }
              }
            }
          }
          return element;
        };
      })(this);
      rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
        headless: this.options.headless,
        allowSurrogateChars: this.options.allowSurrogateChars
      });
      return render(rootElement, rootObj).end(this.options.renderOpts);
    };

    return Builder;

  })();

}).call(this);


/***/ }),

/***/ 7251:
/***/ (function(__unused_webpack_module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  exports.defaults = {
    "0.1": {
      explicitCharkey: false,
      trim: true,
      normalize: true,
      normalizeTags: false,
      attrkey: "@",
      charkey: "#",
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false,
      explicitRoot: false,
      validator: null,
      xmlns: false,
      explicitChildren: false,
      childkey: '@@',
      charsAsChildren: false,
      includeWhiteChars: false,
      async: false,
      strict: true,
      attrNameProcessors: null,
      attrValueProcessors: null,
      tagNameProcessors: null,
      valueProcessors: null,
      emptyTag: ''
    },
    "0.2": {
      explicitCharkey: false,
      trim: false,
      normalize: false,
      normalizeTags: false,
      attrkey: "$",
      charkey: "_",
      explicitArray: true,
      ignoreAttrs: false,
      mergeAttrs: false,
      explicitRoot: true,
      validator: null,
      xmlns: false,
      explicitChildren: false,
      preserveChildrenOrder: false,
      childkey: '$$',
      charsAsChildren: false,
      includeWhiteChars: false,
      async: false,
      strict: true,
      attrNameProcessors: null,
      attrValueProcessors: null,
      tagNameProcessors: null,
      valueProcessors: null,
      rootName: 'root',
      xmldec: {
        'version': '1.0',
        'encoding': 'UTF-8',
        'standalone': true
      },
      doctype: null,
      renderOpts: {
        'pretty': true,
        'indent': '  ',
        'newline': '\n'
      },
      headless: false,
      chunkSize: 10000,
      emptyTag: '',
      cdata: false
    }
  };

}).call(this);


/***/ }),

/***/ 3314:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var bom, defaults, events, isEmpty, processItem, processors, sax, setImmediate,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  sax = __nccwpck_require__(2043);

  events = __nccwpck_require__(2361);

  bom = __nccwpck_require__(2624);

  processors = __nccwpck_require__(9236);

  setImmediate = (__nccwpck_require__(9512).setImmediate);

  defaults = (__nccwpck_require__(7251).defaults);

  isEmpty = function(thing) {
    return typeof thing === "object" && (thing != null) && Object.keys(thing).length === 0;
  };

  processItem = function(processors, item, key) {
    var i, len, process;
    for (i = 0, len = processors.length; i < len; i++) {
      process = processors[i];
      item = process(item, key);
    }
    return item;
  };

  exports.Parser = (function(superClass) {
    extend(Parser, superClass);

    function Parser(opts) {
      this.parseStringPromise = bind(this.parseStringPromise, this);
      this.parseString = bind(this.parseString, this);
      this.reset = bind(this.reset, this);
      this.assignOrPush = bind(this.assignOrPush, this);
      this.processAsync = bind(this.processAsync, this);
      var key, ref, value;
      if (!(this instanceof exports.Parser)) {
        return new exports.Parser(opts);
      }
      this.options = {};
      ref = defaults["0.2"];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this.options[key] = value;
      }
      for (key in opts) {
        if (!hasProp.call(opts, key)) continue;
        value = opts[key];
        this.options[key] = value;
      }
      if (this.options.xmlns) {
        this.options.xmlnskey = this.options.attrkey + "ns";
      }
      if (this.options.normalizeTags) {
        if (!this.options.tagNameProcessors) {
          this.options.tagNameProcessors = [];
        }
        this.options.tagNameProcessors.unshift(processors.normalize);
      }
      this.reset();
    }

    Parser.prototype.processAsync = function() {
      var chunk, err;
      try {
        if (this.remaining.length <= this.options.chunkSize) {
          chunk = this.remaining;
          this.remaining = '';
          this.saxParser = this.saxParser.write(chunk);
          return this.saxParser.close();
        } else {
          chunk = this.remaining.substr(0, this.options.chunkSize);
          this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
          this.saxParser = this.saxParser.write(chunk);
          return setImmediate(this.processAsync);
        }
      } catch (error1) {
        err = error1;
        if (!this.saxParser.errThrown) {
          this.saxParser.errThrown = true;
          return this.emit(err);
        }
      }
    };

    Parser.prototype.assignOrPush = function(obj, key, newValue) {
      if (!(key in obj)) {
        if (!this.options.explicitArray) {
          return obj[key] = newValue;
        } else {
          return obj[key] = [newValue];
        }
      } else {
        if (!(obj[key] instanceof Array)) {
          obj[key] = [obj[key]];
        }
        return obj[key].push(newValue);
      }
    };

    Parser.prototype.reset = function() {
      var attrkey, charkey, ontext, stack;
      this.removeAllListeners();
      this.saxParser = sax.parser(this.options.strict, {
        trim: false,
        normalize: false,
        xmlns: this.options.xmlns
      });
      this.saxParser.errThrown = false;
      this.saxParser.onerror = (function(_this) {
        return function(error) {
          _this.saxParser.resume();
          if (!_this.saxParser.errThrown) {
            _this.saxParser.errThrown = true;
            return _this.emit("error", error);
          }
        };
      })(this);
      this.saxParser.onend = (function(_this) {
        return function() {
          if (!_this.saxParser.ended) {
            _this.saxParser.ended = true;
            return _this.emit("end", _this.resultObject);
          }
        };
      })(this);
      this.saxParser.ended = false;
      this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
      this.resultObject = null;
      stack = [];
      attrkey = this.options.attrkey;
      charkey = this.options.charkey;
      this.saxParser.onopentag = (function(_this) {
        return function(node) {
          var key, newValue, obj, processedKey, ref;
          obj = {};
          obj[charkey] = "";
          if (!_this.options.ignoreAttrs) {
            ref = node.attributes;
            for (key in ref) {
              if (!hasProp.call(ref, key)) continue;
              if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                obj[attrkey] = {};
              }
              newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
              processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
              if (_this.options.mergeAttrs) {
                _this.assignOrPush(obj, processedKey, newValue);
              } else {
                obj[attrkey][processedKey] = newValue;
              }
            }
          }
          obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
          if (_this.options.xmlns) {
            obj[_this.options.xmlnskey] = {
              uri: node.uri,
              local: node.local
            };
          }
          return stack.push(obj);
        };
      })(this);
      this.saxParser.onclosetag = (function(_this) {
        return function() {
          var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
          obj = stack.pop();
          nodeName = obj["#name"];
          if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
            delete obj["#name"];
          }
          if (obj.cdata === true) {
            cdata = obj.cdata;
            delete obj.cdata;
          }
          s = stack[stack.length - 1];
          if (obj[charkey].match(/^\s*$/) && !cdata) {
            emptyStr = obj[charkey];
            delete obj[charkey];
          } else {
            if (_this.options.trim) {
              obj[charkey] = obj[charkey].trim();
            }
            if (_this.options.normalize) {
              obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
            }
            obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
            if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
              obj = obj[charkey];
            }
          }
          if (isEmpty(obj)) {
            obj = _this.options.emptyTag !== '' ? _this.options.emptyTag : emptyStr;
          }
          if (_this.options.validator != null) {
            xpath = "/" + ((function() {
              var i, len, results;
              results = [];
              for (i = 0, len = stack.length; i < len; i++) {
                node = stack[i];
                results.push(node["#name"]);
              }
              return results;
            })()).concat(nodeName).join("/");
            (function() {
              var err;
              try {
                return obj = _this.options.validator(xpath, s && s[nodeName], obj);
              } catch (error1) {
                err = error1;
                return _this.emit("error", err);
              }
            })();
          }
          if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === 'object') {
            if (!_this.options.preserveChildrenOrder) {
              node = {};
              if (_this.options.attrkey in obj) {
                node[_this.options.attrkey] = obj[_this.options.attrkey];
                delete obj[_this.options.attrkey];
              }
              if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                node[_this.options.charkey] = obj[_this.options.charkey];
                delete obj[_this.options.charkey];
              }
              if (Object.getOwnPropertyNames(obj).length > 0) {
                node[_this.options.childkey] = obj;
              }
              obj = node;
            } else if (s) {
              s[_this.options.childkey] = s[_this.options.childkey] || [];
              objClone = {};
              for (key in obj) {
                if (!hasProp.call(obj, key)) continue;
                objClone[key] = obj[key];
              }
              s[_this.options.childkey].push(objClone);
              delete obj["#name"];
              if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                obj = obj[charkey];
              }
            }
          }
          if (stack.length > 0) {
            return _this.assignOrPush(s, nodeName, obj);
          } else {
            if (_this.options.explicitRoot) {
              old = obj;
              obj = {};
              obj[nodeName] = old;
            }
            _this.resultObject = obj;
            _this.saxParser.ended = true;
            return _this.emit("end", _this.resultObject);
          }
        };
      })(this);
      ontext = (function(_this) {
        return function(text) {
          var charChild, s;
          s = stack[stack.length - 1];
          if (s) {
            s[charkey] += text;
            if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, '').trim() !== '')) {
              s[_this.options.childkey] = s[_this.options.childkey] || [];
              charChild = {
                '#name': '__text__'
              };
              charChild[charkey] = text;
              if (_this.options.normalize) {
                charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
              }
              s[_this.options.childkey].push(charChild);
            }
            return s;
          }
        };
      })(this);
      this.saxParser.ontext = ontext;
      return this.saxParser.oncdata = (function(_this) {
        return function(text) {
          var s;
          s = ontext(text);
          if (s) {
            return s.cdata = true;
          }
        };
      })(this);
    };

    Parser.prototype.parseString = function(str, cb) {
      var err;
      if ((cb != null) && typeof cb === "function") {
        this.on("end", function(result) {
          this.reset();
          return cb(null, result);
        });
        this.on("error", function(err) {
          this.reset();
          return cb(err);
        });
      }
      try {
        str = str.toString();
        if (str.trim() === '') {
          this.emit("end", null);
          return true;
        }
        str = bom.stripBOM(str);
        if (this.options.async) {
          this.remaining = str;
          setImmediate(this.processAsync);
          return this.saxParser;
        }
        return this.saxParser.write(str).close();
      } catch (error1) {
        err = error1;
        if (!(this.saxParser.errThrown || this.saxParser.ended)) {
          this.emit('error', err);
          return this.saxParser.errThrown = true;
        } else if (this.saxParser.ended) {
          throw err;
        }
      }
    };

    Parser.prototype.parseStringPromise = function(str) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.parseString(str, function(err, value) {
            if (err) {
              return reject(err);
            } else {
              return resolve(value);
            }
          });
        };
      })(this));
    };

    return Parser;

  })(events);

  exports.parseString = function(str, a, b) {
    var cb, options, parser;
    if (b != null) {
      if (typeof b === 'function') {
        cb = b;
      }
      if (typeof a === 'object') {
        options = a;
      }
    } else {
      if (typeof a === 'function') {
        cb = a;
      }
      options = {};
    }
    parser = new exports.Parser(options);
    return parser.parseString(str, cb);
  };

  exports.parseStringPromise = function(str, a) {
    var options, parser;
    if (typeof a === 'object') {
      options = a;
    }
    parser = new exports.Parser(options);
    return parser.parseStringPromise(str);
  };

}).call(this);


/***/ }),

/***/ 9236:
/***/ (function(__unused_webpack_module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var prefixMatch;

  prefixMatch = new RegExp(/(?!xmlns)^.*:/);

  exports.normalize = function(str) {
    return str.toLowerCase();
  };

  exports.firstCharLowerCase = function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };

  exports.stripPrefix = function(str) {
    return str.replace(prefixMatch, '');
  };

  exports.parseNumbers = function(str) {
    if (!isNaN(str)) {
      str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
    }
    return str;
  };

  exports.parseBooleans = function(str) {
    if (/^(?:true|false)$/i.test(str)) {
      str = str.toLowerCase() === 'true';
    }
    return str;
  };

}).call(this);


/***/ }),

/***/ 6189:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var builder, defaults, parser, processors,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  defaults = __nccwpck_require__(7251);

  builder = __nccwpck_require__(3337);

  parser = __nccwpck_require__(3314);

  processors = __nccwpck_require__(9236);

  exports.defaults = defaults.defaults;

  exports.processors = processors;

  exports.ValidationError = (function(superClass) {
    extend(ValidationError, superClass);

    function ValidationError(message) {
      this.message = message;
    }

    return ValidationError;

  })(Error);

  exports.Builder = builder.Builder;

  exports.Parser = parser.Parser;

  exports.parseString = parser.parseString;

  exports.parseStringPromise = parser.parseStringPromise;

}).call(this);


/***/ }),

/***/ 2839:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  module.exports = {
    Disconnected: 1,
    Preceding: 2,
    Following: 4,
    Contains: 8,
    ContainedBy: 16,
    ImplementationSpecific: 32
  };

}).call(this);


/***/ }),

/***/ 9267:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  module.exports = {
    Element: 1,
    Attribute: 2,
    Text: 3,
    CData: 4,
    EntityReference: 5,
    EntityDeclaration: 6,
    ProcessingInstruction: 7,
    Comment: 8,
    Document: 9,
    DocType: 10,
    DocumentFragment: 11,
    NotationDeclaration: 12,
    Declaration: 201,
    Raw: 202,
    AttributeDeclaration: 203,
    ElementDeclaration: 204,
    Dummy: 205
  };

}).call(this);


/***/ }),

/***/ 8229:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject,
    slice = [].slice,
    hasProp = {}.hasOwnProperty;

  assign = function() {
    var i, key, len, source, sources, target;
    target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (isFunction(Object.assign)) {
      Object.assign.apply(null, arguments);
    } else {
      for (i = 0, len = sources.length; i < len; i++) {
        source = sources[i];
        if (source != null) {
          for (key in source) {
            if (!hasProp.call(source, key)) continue;
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };

  isFunction = function(val) {
    return !!val && Object.prototype.toString.call(val) === '[object Function]';
  };

  isObject = function(val) {
    var ref;
    return !!val && ((ref = typeof val) === 'function' || ref === 'object');
  };

  isArray = function(val) {
    if (isFunction(Array.isArray)) {
      return Array.isArray(val);
    } else {
      return Object.prototype.toString.call(val) === '[object Array]';
    }
  };

  isEmpty = function(val) {
    var key;
    if (isArray(val)) {
      return !val.length;
    } else {
      for (key in val) {
        if (!hasProp.call(val, key)) continue;
        return false;
      }
      return true;
    }
  };

  isPlainObject = function(val) {
    var ctor, proto;
    return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && (typeof ctor === 'function') && (ctor instanceof ctor) && (Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object));
  };

  getValue = function(obj) {
    if (isFunction(obj.valueOf)) {
      return obj.valueOf();
    } else {
      return obj;
    }
  };

  module.exports.assign = assign;

  module.exports.isFunction = isFunction;

  module.exports.isObject = isObject;

  module.exports.isArray = isArray;

  module.exports.isEmpty = isEmpty;

  module.exports.isPlainObject = isPlainObject;

  module.exports.getValue = getValue;

}).call(this);


/***/ }),

/***/ 9766:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  module.exports = {
    None: 0,
    OpenTag: 1,
    InsideTag: 2,
    CloseTag: 3
  };

}).call(this);


/***/ }),

/***/ 8376:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLAttribute, XMLNode;

  NodeType = __nccwpck_require__(9267);

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLAttribute = (function() {
    function XMLAttribute(parent, name, value) {
      this.parent = parent;
      if (this.parent) {
        this.options = this.parent.options;
        this.stringify = this.parent.stringify;
      }
      if (name == null) {
        throw new Error("Missing attribute name. " + this.debugInfo(name));
      }
      this.name = this.stringify.name(name);
      this.value = this.stringify.attValue(value);
      this.type = NodeType.Attribute;
      this.isId = false;
      this.schemaTypeInfo = null;
    }

    Object.defineProperty(XMLAttribute.prototype, 'nodeType', {
      get: function() {
        return this.type;
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'ownerElement', {
      get: function() {
        return this.parent;
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'textContent', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'namespaceURI', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'prefix', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'localName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'specified', {
      get: function() {
        return true;
      }
    });

    XMLAttribute.prototype.clone = function() {
      return Object.create(this);
    };

    XMLAttribute.prototype.toString = function(options) {
      return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
    };

    XMLAttribute.prototype.debugInfo = function(name) {
      name = name || this.name;
      if (name == null) {
        return "parent: <" + this.parent.name + ">";
      } else {
        return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
      }
    };

    XMLAttribute.prototype.isEqualNode = function(node) {
      if (node.namespaceURI !== this.namespaceURI) {
        return false;
      }
      if (node.prefix !== this.prefix) {
        return false;
      }
      if (node.localName !== this.localName) {
        return false;
      }
      if (node.value !== this.value) {
        return false;
      }
      return true;
    };

    return XMLAttribute;

  })();

}).call(this);


/***/ }),

/***/ 333:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLCData, XMLCharacterData,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __nccwpck_require__(9267);

  XMLCharacterData = __nccwpck_require__(7709);

  module.exports = XMLCData = (function(superClass) {
    extend(XMLCData, superClass);

    function XMLCData(parent, text) {
      XMLCData.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing CDATA text. " + this.debugInfo());
      }
      this.name = "#cdata-section";
      this.type = NodeType.CData;
      this.value = this.stringify.cdata(text);
    }

    XMLCData.prototype.clone = function() {
      return Object.create(this);
    };

    XMLCData.prototype.toString = function(options) {
      return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
    };

    return XMLCData;

  })(XMLCharacterData);

}).call(this);


/***/ }),

/***/ 7709:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCharacterData, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLCharacterData = (function(superClass) {
    extend(XMLCharacterData, superClass);

    function XMLCharacterData(parent) {
      XMLCharacterData.__super__.constructor.call(this, parent);
      this.value = '';
    }

    Object.defineProperty(XMLCharacterData.prototype, 'data', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    Object.defineProperty(XMLCharacterData.prototype, 'length', {
      get: function() {
        return this.value.length;
      }
    });

    Object.defineProperty(XMLCharacterData.prototype, 'textContent', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    XMLCharacterData.prototype.clone = function() {
      return Object.create(this);
    };

    XMLCharacterData.prototype.substringData = function(offset, count) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.appendData = function(arg) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.insertData = function(offset, arg) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.deleteData = function(offset, count) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.replaceData = function(offset, count, arg) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.isEqualNode = function(node) {
      if (!XMLCharacterData.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
        return false;
      }
      if (node.data !== this.data) {
        return false;
      }
      return true;
    };

    return XMLCharacterData;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 4407:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLCharacterData, XMLComment,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __nccwpck_require__(9267);

  XMLCharacterData = __nccwpck_require__(7709);

  module.exports = XMLComment = (function(superClass) {
    extend(XMLComment, superClass);

    function XMLComment(parent, text) {
      XMLComment.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing comment text. " + this.debugInfo());
      }
      this.name = "#comment";
      this.type = NodeType.Comment;
      this.value = this.stringify.comment(text);
    }

    XMLComment.prototype.clone = function() {
      return Object.create(this);
    };

    XMLComment.prototype.toString = function(options) {
      return this.options.writer.comment(this, this.options.writer.filterOptions(options));
    };

    return XMLComment;

  })(XMLCharacterData);

}).call(this);


/***/ }),

/***/ 7465:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;

  XMLDOMErrorHandler = __nccwpck_require__(6744);

  XMLDOMStringList = __nccwpck_require__(7028);

  module.exports = XMLDOMConfiguration = (function() {
    function XMLDOMConfiguration() {
      var clonedSelf;
      this.defaultParams = {
        "canonical-form": false,
        "cdata-sections": false,
        "comments": false,
        "datatype-normalization": false,
        "element-content-whitespace": true,
        "entities": true,
        "error-handler": new XMLDOMErrorHandler(),
        "infoset": true,
        "validate-if-schema": false,
        "namespaces": true,
        "namespace-declarations": true,
        "normalize-characters": false,
        "schema-location": '',
        "schema-type": '',
        "split-cdata-sections": true,
        "validate": false,
        "well-formed": true
      };
      this.params = clonedSelf = Object.create(this.defaultParams);
    }

    Object.defineProperty(XMLDOMConfiguration.prototype, 'parameterNames', {
      get: function() {
        return new XMLDOMStringList(Object.keys(this.defaultParams));
      }
    });

    XMLDOMConfiguration.prototype.getParameter = function(name) {
      if (this.params.hasOwnProperty(name)) {
        return this.params[name];
      } else {
        return null;
      }
    };

    XMLDOMConfiguration.prototype.canSetParameter = function(name, value) {
      return true;
    };

    XMLDOMConfiguration.prototype.setParameter = function(name, value) {
      if (value != null) {
        return this.params[name] = value;
      } else {
        return delete this.params[name];
      }
    };

    return XMLDOMConfiguration;

  })();

}).call(this);


/***/ }),

/***/ 6744:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDOMErrorHandler;

  module.exports = XMLDOMErrorHandler = (function() {
    function XMLDOMErrorHandler() {}

    XMLDOMErrorHandler.prototype.handleError = function(error) {
      throw new Error(error);
    };

    return XMLDOMErrorHandler;

  })();

}).call(this);


/***/ }),

/***/ 8310:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDOMImplementation;

  module.exports = XMLDOMImplementation = (function() {
    function XMLDOMImplementation() {}

    XMLDOMImplementation.prototype.hasFeature = function(feature, version) {
      return true;
    };

    XMLDOMImplementation.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLDOMImplementation.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLDOMImplementation.prototype.createHTMLDocument = function(title) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLDOMImplementation.prototype.getFeature = function(feature, version) {
      throw new Error("This DOM method is not implemented.");
    };

    return XMLDOMImplementation;

  })();

}).call(this);


/***/ }),

/***/ 7028:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDOMStringList;

  module.exports = XMLDOMStringList = (function() {
    function XMLDOMStringList(arr) {
      this.arr = arr || [];
    }

    Object.defineProperty(XMLDOMStringList.prototype, 'length', {
      get: function() {
        return this.arr.length;
      }
    });

    XMLDOMStringList.prototype.item = function(index) {
      return this.arr[index] || null;
    };

    XMLDOMStringList.prototype.contains = function(str) {
      return this.arr.indexOf(str) !== -1;
    };

    return XMLDOMStringList;

  })();

}).call(this);


/***/ }),

/***/ 1015:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDAttList, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  module.exports = XMLDTDAttList = (function(superClass) {
    extend(XMLDTDAttList, superClass);

    function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      XMLDTDAttList.__super__.constructor.call(this, parent);
      if (elementName == null) {
        throw new Error("Missing DTD element name. " + this.debugInfo());
      }
      if (attributeName == null) {
        throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
      }
      if (!attributeType) {
        throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
      }
      if (!defaultValueType) {
        throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
      }
      if (defaultValueType.indexOf('#') !== 0) {
        defaultValueType = '#' + defaultValueType;
      }
      if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
        throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
      }
      if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
        throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
      }
      this.elementName = this.stringify.name(elementName);
      this.type = NodeType.AttributeDeclaration;
      this.attributeName = this.stringify.name(attributeName);
      this.attributeType = this.stringify.dtdAttType(attributeType);
      if (defaultValue) {
        this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
      }
      this.defaultValueType = defaultValueType;
    }

    XMLDTDAttList.prototype.toString = function(options) {
      return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
    };

    return XMLDTDAttList;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 2421:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDElement, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  module.exports = XMLDTDElement = (function(superClass) {
    extend(XMLDTDElement, superClass);

    function XMLDTDElement(parent, name, value) {
      XMLDTDElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing DTD element name. " + this.debugInfo());
      }
      if (!value) {
        value = '(#PCDATA)';
      }
      if (Array.isArray(value)) {
        value = '(' + value.join(',') + ')';
      }
      this.name = this.stringify.name(name);
      this.type = NodeType.ElementDeclaration;
      this.value = this.stringify.dtdElementValue(value);
    }

    XMLDTDElement.prototype.toString = function(options) {
      return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
    };

    return XMLDTDElement;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 53:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDEntity, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = (__nccwpck_require__(8229).isObject);

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  module.exports = XMLDTDEntity = (function(superClass) {
    extend(XMLDTDEntity, superClass);

    function XMLDTDEntity(parent, pe, name, value) {
      XMLDTDEntity.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing DTD entity name. " + this.debugInfo(name));
      }
      if (value == null) {
        throw new Error("Missing DTD entity value. " + this.debugInfo(name));
      }
      this.pe = !!pe;
      this.name = this.stringify.name(name);
      this.type = NodeType.EntityDeclaration;
      if (!isObject(value)) {
        this.value = this.stringify.dtdEntityValue(value);
        this.internal = true;
      } else {
        if (!value.pubID && !value.sysID) {
          throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
        }
        if (value.pubID && !value.sysID) {
          throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
        }
        this.internal = false;
        if (value.pubID != null) {
          this.pubID = this.stringify.dtdPubID(value.pubID);
        }
        if (value.sysID != null) {
          this.sysID = this.stringify.dtdSysID(value.sysID);
        }
        if (value.nData != null) {
          this.nData = this.stringify.dtdNData(value.nData);
        }
        if (this.pe && this.nData) {
          throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
        }
      }
    }

    Object.defineProperty(XMLDTDEntity.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'notationName', {
      get: function() {
        return this.nData || null;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'inputEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'xmlEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'xmlVersion', {
      get: function() {
        return null;
      }
    });

    XMLDTDEntity.prototype.toString = function(options) {
      return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
    };

    return XMLDTDEntity;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 2837:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDNotation, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  module.exports = XMLDTDNotation = (function(superClass) {
    extend(XMLDTDNotation, superClass);

    function XMLDTDNotation(parent, name, value) {
      XMLDTDNotation.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing DTD notation name. " + this.debugInfo(name));
      }
      if (!value.pubID && !value.sysID) {
        throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
      }
      this.name = this.stringify.name(name);
      this.type = NodeType.NotationDeclaration;
      if (value.pubID != null) {
        this.pubID = this.stringify.dtdPubID(value.pubID);
      }
      if (value.sysID != null) {
        this.sysID = this.stringify.dtdSysID(value.sysID);
      }
    }

    Object.defineProperty(XMLDTDNotation.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDTDNotation.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    XMLDTDNotation.prototype.toString = function(options) {
      return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
    };

    return XMLDTDNotation;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 6364:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDeclaration, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = (__nccwpck_require__(8229).isObject);

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  module.exports = XMLDeclaration = (function(superClass) {
    extend(XMLDeclaration, superClass);

    function XMLDeclaration(parent, version, encoding, standalone) {
      var ref;
      XMLDeclaration.__super__.constructor.call(this, parent);
      if (isObject(version)) {
        ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
      }
      if (!version) {
        version = '1.0';
      }
      this.type = NodeType.Declaration;
      this.version = this.stringify.xmlVersion(version);
      if (encoding != null) {
        this.encoding = this.stringify.xmlEncoding(encoding);
      }
      if (standalone != null) {
        this.standalone = this.stringify.xmlStandalone(standalone);
      }
    }

    XMLDeclaration.prototype.toString = function(options) {
      return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
    };

    return XMLDeclaration;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 1801:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = (__nccwpck_require__(8229).isObject);

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDNotation = __nccwpck_require__(2837);

  XMLNamedNodeMap = __nccwpck_require__(4361);

  module.exports = XMLDocType = (function(superClass) {
    extend(XMLDocType, superClass);

    function XMLDocType(parent, pubID, sysID) {
      var child, i, len, ref, ref1, ref2;
      XMLDocType.__super__.constructor.call(this, parent);
      this.type = NodeType.DocType;
      if (parent.children) {
        ref = parent.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (child.type === NodeType.Element) {
            this.name = child.name;
            break;
          }
        }
      }
      this.documentObject = parent;
      if (isObject(pubID)) {
        ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
      }
      if (sysID == null) {
        ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
      }
      if (pubID != null) {
        this.pubID = this.stringify.dtdPubID(pubID);
      }
      if (sysID != null) {
        this.sysID = this.stringify.dtdSysID(sysID);
      }
    }

    Object.defineProperty(XMLDocType.prototype, 'entities', {
      get: function() {
        var child, i, len, nodes, ref;
        nodes = {};
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if ((child.type === NodeType.EntityDeclaration) && !child.pe) {
            nodes[child.name] = child;
          }
        }
        return new XMLNamedNodeMap(nodes);
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'notations', {
      get: function() {
        var child, i, len, nodes, ref;
        nodes = {};
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (child.type === NodeType.NotationDeclaration) {
            nodes[child.name] = child;
          }
        }
        return new XMLNamedNodeMap(nodes);
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'internalSubset', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    XMLDocType.prototype.element = function(name, value) {
      var child;
      child = new XMLDTDElement(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var child;
      child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.entity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, false, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.pEntity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, true, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.notation = function(name, value) {
      var child;
      child = new XMLDTDNotation(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.toString = function(options) {
      return this.options.writer.docType(this, this.options.writer.filterOptions(options));
    };

    XMLDocType.prototype.ele = function(name, value) {
      return this.element(name, value);
    };

    XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
    };

    XMLDocType.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocType.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocType.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    XMLDocType.prototype.up = function() {
      return this.root() || this.documentObject;
    };

    XMLDocType.prototype.isEqualNode = function(node) {
      if (!XMLDocType.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
        return false;
      }
      if (node.name !== this.name) {
        return false;
      }
      if (node.publicId !== this.publicId) {
        return false;
      }
      if (node.systemId !== this.systemId) {
        return false;
      }
      return true;
    };

    return XMLDocType;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 3730:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isPlainObject = (__nccwpck_require__(8229).isPlainObject);

  XMLDOMImplementation = __nccwpck_require__(8310);

  XMLDOMConfiguration = __nccwpck_require__(7465);

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  XMLStringifier = __nccwpck_require__(8594);

  XMLStringWriter = __nccwpck_require__(5913);

  module.exports = XMLDocument = (function(superClass) {
    extend(XMLDocument, superClass);

    function XMLDocument(options) {
      XMLDocument.__super__.constructor.call(this, null);
      this.name = "#document";
      this.type = NodeType.Document;
      this.documentURI = null;
      this.domConfig = new XMLDOMConfiguration();
      options || (options = {});
      if (!options.writer) {
        options.writer = new XMLStringWriter();
      }
      this.options = options;
      this.stringify = new XMLStringifier(options);
    }

    Object.defineProperty(XMLDocument.prototype, 'implementation', {
      value: new XMLDOMImplementation()
    });

    Object.defineProperty(XMLDocument.prototype, 'doctype', {
      get: function() {
        var child, i, len, ref;
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (child.type === NodeType.DocType) {
            return child;
          }
        }
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'documentElement', {
      get: function() {
        return this.rootObject || null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'inputEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'strictErrorChecking', {
      get: function() {
        return false;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlEncoding', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].encoding;
        } else {
          return null;
        }
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlStandalone', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].standalone === 'yes';
        } else {
          return false;
        }
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlVersion', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].version;
        } else {
          return "1.0";
        }
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'URL', {
      get: function() {
        return this.documentURI;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'origin', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'compatMode', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'characterSet', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'contentType', {
      get: function() {
        return null;
      }
    });

    XMLDocument.prototype.end = function(writer) {
      var writerOptions;
      writerOptions = {};
      if (!writer) {
        writer = this.options.writer;
      } else if (isPlainObject(writer)) {
        writerOptions = writer;
        writer = this.options.writer;
      }
      return writer.document(this, writer.filterOptions(writerOptions));
    };

    XMLDocument.prototype.toString = function(options) {
      return this.options.writer.document(this, this.options.writer.filterOptions(options));
    };

    XMLDocument.prototype.createElement = function(tagName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createDocumentFragment = function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createTextNode = function(data) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createComment = function(data) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createCDATASection = function(data) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createProcessingInstruction = function(target, data) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createAttribute = function(name) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createEntityReference = function(name) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.getElementsByTagName = function(tagname) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.importNode = function(importedNode, deep) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createElementNS = function(namespaceURI, qualifiedName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.getElementById = function(elementId) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.adoptNode = function(source) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.normalizeDocument = function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.renameNode = function(node, namespaceURI, qualifiedName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.getElementsByClassName = function(classNames) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createEvent = function(eventInterface) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createRange = function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createNodeIterator = function(root, whatToShow, filter) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createTreeWalker = function(root, whatToShow, filter) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    return XMLDocument;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 7356:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref,
    hasProp = {}.hasOwnProperty;

  ref = __nccwpck_require__(8229), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;

  NodeType = __nccwpck_require__(9267);

  XMLDocument = __nccwpck_require__(3730);

  XMLElement = __nccwpck_require__(9437);

  XMLCData = __nccwpck_require__(333);

  XMLComment = __nccwpck_require__(4407);

  XMLRaw = __nccwpck_require__(6329);

  XMLText = __nccwpck_require__(1318);

  XMLProcessingInstruction = __nccwpck_require__(6939);

  XMLDeclaration = __nccwpck_require__(6364);

  XMLDocType = __nccwpck_require__(1801);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDNotation = __nccwpck_require__(2837);

  XMLAttribute = __nccwpck_require__(8376);

  XMLStringifier = __nccwpck_require__(8594);

  XMLStringWriter = __nccwpck_require__(5913);

  WriterState = __nccwpck_require__(9766);

  module.exports = XMLDocumentCB = (function() {
    function XMLDocumentCB(options, onData, onEnd) {
      var writerOptions;
      this.name = "?xml";
      this.type = NodeType.Document;
      options || (options = {});
      writerOptions = {};
      if (!options.writer) {
        options.writer = new XMLStringWriter();
      } else if (isPlainObject(options.writer)) {
        writerOptions = options.writer;
        options.writer = new XMLStringWriter();
      }
      this.options = options;
      this.writer = options.writer;
      this.writerOptions = this.writer.filterOptions(writerOptions);
      this.stringify = new XMLStringifier(options);
      this.onDataCallback = onData || function() {};
      this.onEndCallback = onEnd || function() {};
      this.currentNode = null;
      this.currentLevel = -1;
      this.openTags = {};
      this.documentStarted = false;
      this.documentCompleted = false;
      this.root = null;
    }

    XMLDocumentCB.prototype.createChildNode = function(node) {
      var att, attName, attributes, child, i, len, ref1, ref2;
      switch (node.type) {
        case NodeType.CData:
          this.cdata(node.value);
          break;
        case NodeType.Comment:
          this.comment(node.value);
          break;
        case NodeType.Element:
          attributes = {};
          ref1 = node.attribs;
          for (attName in ref1) {
            if (!hasProp.call(ref1, attName)) continue;
            att = ref1[attName];
            attributes[attName] = att.value;
          }
          this.node(node.name, attributes);
          break;
        case NodeType.Dummy:
          this.dummy();
          break;
        case NodeType.Raw:
          this.raw(node.value);
          break;
        case NodeType.Text:
          this.text(node.value);
          break;
        case NodeType.ProcessingInstruction:
          this.instruction(node.target, node.value);
          break;
        default:
          throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
      }
      ref2 = node.children;
      for (i = 0, len = ref2.length; i < len; i++) {
        child = ref2[i];
        this.createChildNode(child);
        if (child.type === NodeType.Element) {
          this.up();
        }
      }
      return this;
    };

    XMLDocumentCB.prototype.dummy = function() {
      return this;
    };

    XMLDocumentCB.prototype.node = function(name, attributes, text) {
      var ref1;
      if (name == null) {
        throw new Error("Missing node name.");
      }
      if (this.root && this.currentLevel === -1) {
        throw new Error("Document can only have one root node. " + this.debugInfo(name));
      }
      this.openCurrent();
      name = getValue(name);
      if (attributes == null) {
        attributes = {};
      }
      attributes = getValue(attributes);
      if (!isObject(attributes)) {
        ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
      }
      this.currentNode = new XMLElement(this, name, attributes);
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      if (text != null) {
        this.text(text);
      }
      return this;
    };

    XMLDocumentCB.prototype.element = function(name, attributes, text) {
      var child, i, len, oldValidationFlag, ref1, root;
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        this.dtdElement.apply(this, arguments);
      } else {
        if (Array.isArray(name) || isObject(name) || isFunction(name)) {
          oldValidationFlag = this.options.noValidation;
          this.options.noValidation = true;
          root = new XMLDocument(this.options).element('TEMP_ROOT');
          root.element(name);
          this.options.noValidation = oldValidationFlag;
          ref1 = root.children;
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            this.createChildNode(child);
            if (child.type === NodeType.Element) {
              this.up();
            }
          }
        } else {
          this.node(name, attributes, text);
        }
      }
      return this;
    };

    XMLDocumentCB.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (!this.currentNode || this.currentNode.children) {
        throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
      }
      if (name != null) {
        name = getValue(name);
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (this.options.keepNullAttributes && (value == null)) {
          this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
        } else if (value != null) {
          this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLDocumentCB.prototype.text = function(value) {
      var node;
      this.openCurrent();
      node = new XMLText(this, value);
      this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.cdata = function(value) {
      var node;
      this.openCurrent();
      node = new XMLCData(this, value);
      this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.comment = function(value) {
      var node;
      this.openCurrent();
      node = new XMLComment(this, value);
      this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.raw = function(value) {
      var node;
      this.openCurrent();
      node = new XMLRaw(this, value);
      this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.instruction = function(target, value) {
      var i, insTarget, insValue, len, node;
      this.openCurrent();
      if (target != null) {
        target = getValue(target);
      }
      if (value != null) {
        value = getValue(value);
      }
      if (Array.isArray(target)) {
        for (i = 0, len = target.length; i < len; i++) {
          insTarget = target[i];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        node = new XMLProcessingInstruction(this, target, value);
        this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      }
      return this;
    };

    XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
      var node;
      this.openCurrent();
      if (this.documentStarted) {
        throw new Error("declaration() must be the first node.");
      }
      node = new XMLDeclaration(this, version, encoding, standalone);
      this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
      this.openCurrent();
      if (root == null) {
        throw new Error("Missing root node name.");
      }
      if (this.root) {
        throw new Error("dtd() must come before the root node.");
      }
      this.currentNode = new XMLDocType(this, pubID, sysID);
      this.currentNode.rootNodeName = root;
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      return this;
    };

    XMLDocumentCB.prototype.dtdElement = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDElement(this, name, value);
      this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var node;
      this.openCurrent();
      node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.entity = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, false, name, value);
      this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.pEntity = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, true, name, value);
      this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.notation = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDNotation(this, name, value);
      this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.up = function() {
      if (this.currentLevel < 0) {
        throw new Error("The document node has no parent.");
      }
      if (this.currentNode) {
        if (this.currentNode.children) {
          this.closeNode(this.currentNode);
        } else {
          this.openNode(this.currentNode);
        }
        this.currentNode = null;
      } else {
        this.closeNode(this.openTags[this.currentLevel]);
      }
      delete this.openTags[this.currentLevel];
      this.currentLevel--;
      return this;
    };

    XMLDocumentCB.prototype.end = function() {
      while (this.currentLevel >= 0) {
        this.up();
      }
      return this.onEnd();
    };

    XMLDocumentCB.prototype.openCurrent = function() {
      if (this.currentNode) {
        this.currentNode.children = true;
        return this.openNode(this.currentNode);
      }
    };

    XMLDocumentCB.prototype.openNode = function(node) {
      var att, chunk, name, ref1;
      if (!node.isOpen) {
        if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
          this.root = node;
        }
        chunk = '';
        if (node.type === NodeType.Element) {
          this.writerOptions.state = WriterState.OpenTag;
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<' + node.name;
          ref1 = node.attribs;
          for (name in ref1) {
            if (!hasProp.call(ref1, name)) continue;
            att = ref1[name];
            chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
          }
          chunk += (node.children ? '>' : '/>') + this.writer.endline(node, this.writerOptions, this.currentLevel);
          this.writerOptions.state = WriterState.InsideTag;
        } else {
          this.writerOptions.state = WriterState.OpenTag;
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<!DOCTYPE ' + node.rootNodeName;
          if (node.pubID && node.sysID) {
            chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            chunk += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.children) {
            chunk += ' [';
            this.writerOptions.state = WriterState.InsideTag;
          } else {
            this.writerOptions.state = WriterState.CloseTag;
            chunk += '>';
          }
          chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
        }
        this.onData(chunk, this.currentLevel);
        return node.isOpen = true;
      }
    };

    XMLDocumentCB.prototype.closeNode = function(node) {
      var chunk;
      if (!node.isClosed) {
        chunk = '';
        this.writerOptions.state = WriterState.CloseTag;
        if (node.type === NodeType.Element) {
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '</' + node.name + '>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
        } else {
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + ']>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
        }
        this.writerOptions.state = WriterState.None;
        this.onData(chunk, this.currentLevel);
        return node.isClosed = true;
      }
    };

    XMLDocumentCB.prototype.onData = function(chunk, level) {
      this.documentStarted = true;
      return this.onDataCallback(chunk, level + 1);
    };

    XMLDocumentCB.prototype.onEnd = function() {
      this.documentCompleted = true;
      return this.onEndCallback();
    };

    XMLDocumentCB.prototype.debugInfo = function(name) {
      if (name == null) {
        return "";
      } else {
        return "node: <" + name + ">";
      }
    };

    XMLDocumentCB.prototype.ele = function() {
      return this.element.apply(this, arguments);
    };

    XMLDocumentCB.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLDocumentCB.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLDocumentCB.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLDocumentCB.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLDocumentCB.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
      return this.doctype(root, pubID, sysID);
    };

    XMLDocumentCB.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLDocumentCB.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLDocumentCB.prototype.t = function(value) {
      return this.text(value);
    };

    XMLDocumentCB.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLDocumentCB.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLDocumentCB.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLDocumentCB.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocumentCB.prototype.att = function() {
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        return this.attList.apply(this, arguments);
      } else {
        return this.attribute.apply(this, arguments);
      }
    };

    XMLDocumentCB.prototype.a = function() {
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        return this.attList.apply(this, arguments);
      } else {
        return this.attribute.apply(this, arguments);
      }
    };

    XMLDocumentCB.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocumentCB.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocumentCB.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    return XMLDocumentCB;

  })();

}).call(this);


/***/ }),

/***/ 3590:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDummy, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  module.exports = XMLDummy = (function(superClass) {
    extend(XMLDummy, superClass);

    function XMLDummy(parent) {
      XMLDummy.__super__.constructor.call(this, parent);
      this.type = NodeType.Dummy;
    }

    XMLDummy.prototype.clone = function() {
      return Object.create(this);
    };

    XMLDummy.prototype.toString = function(options) {
      return '';
    };

    return XMLDummy;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 9437:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = __nccwpck_require__(8229), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  XMLAttribute = __nccwpck_require__(8376);

  XMLNamedNodeMap = __nccwpck_require__(4361);

  module.exports = XMLElement = (function(superClass) {
    extend(XMLElement, superClass);

    function XMLElement(parent, name, attributes) {
      var child, j, len, ref1;
      XMLElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing element name. " + this.debugInfo());
      }
      this.name = this.stringify.name(name);
      this.type = NodeType.Element;
      this.attribs = {};
      this.schemaTypeInfo = null;
      if (attributes != null) {
        this.attribute(attributes);
      }
      if (parent.type === NodeType.Document) {
        this.isRoot = true;
        this.documentObject = parent;
        parent.rootObject = this;
        if (parent.children) {
          ref1 = parent.children;
          for (j = 0, len = ref1.length; j < len; j++) {
            child = ref1[j];
            if (child.type === NodeType.DocType) {
              child.name = this.name;
              break;
            }
          }
        }
      }
    }

    Object.defineProperty(XMLElement.prototype, 'tagName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLElement.prototype, 'namespaceURI', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLElement.prototype, 'prefix', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLElement.prototype, 'localName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLElement.prototype, 'id', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'className', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'classList', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'attributes', {
      get: function() {
        if (!this.attributeMap || !this.attributeMap.nodes) {
          this.attributeMap = new XMLNamedNodeMap(this.attribs);
        }
        return this.attributeMap;
      }
    });

    XMLElement.prototype.clone = function() {
      var att, attName, clonedSelf, ref1;
      clonedSelf = Object.create(this);
      if (clonedSelf.isRoot) {
        clonedSelf.documentObject = null;
      }
      clonedSelf.attribs = {};
      ref1 = this.attribs;
      for (attName in ref1) {
        if (!hasProp.call(ref1, attName)) continue;
        att = ref1[attName];
        clonedSelf.attribs[attName] = att.clone();
      }
      clonedSelf.children = [];
      this.children.forEach(function(child) {
        var clonedChild;
        clonedChild = child.clone();
        clonedChild.parent = clonedSelf;
        return clonedSelf.children.push(clonedChild);
      });
      return clonedSelf;
    };

    XMLElement.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (name != null) {
        name = getValue(name);
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (this.options.keepNullAttributes && (value == null)) {
          this.attribs[name] = new XMLAttribute(this, name, "");
        } else if (value != null) {
          this.attribs[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLElement.prototype.removeAttribute = function(name) {
      var attName, j, len;
      if (name == null) {
        throw new Error("Missing attribute name. " + this.debugInfo());
      }
      name = getValue(name);
      if (Array.isArray(name)) {
        for (j = 0, len = name.length; j < len; j++) {
          attName = name[j];
          delete this.attribs[attName];
        }
      } else {
        delete this.attribs[name];
      }
      return this;
    };

    XMLElement.prototype.toString = function(options) {
      return this.options.writer.element(this, this.options.writer.filterOptions(options));
    };

    XMLElement.prototype.att = function(name, value) {
      return this.attribute(name, value);
    };

    XMLElement.prototype.a = function(name, value) {
      return this.attribute(name, value);
    };

    XMLElement.prototype.getAttribute = function(name) {
      if (this.attribs.hasOwnProperty(name)) {
        return this.attribs[name].value;
      } else {
        return null;
      }
    };

    XMLElement.prototype.setAttribute = function(name, value) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getAttributeNode = function(name) {
      if (this.attribs.hasOwnProperty(name)) {
        return this.attribs[name];
      } else {
        return null;
      }
    };

    XMLElement.prototype.setAttributeNode = function(newAttr) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.removeAttributeNode = function(oldAttr) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByTagName = function(name) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getAttributeNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.removeAttributeNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.setAttributeNodeNS = function(newAttr) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.hasAttribute = function(name) {
      return this.attribs.hasOwnProperty(name);
    };

    XMLElement.prototype.hasAttributeNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.setIdAttribute = function(name, isId) {
      if (this.attribs.hasOwnProperty(name)) {
        return this.attribs[name].isId;
      } else {
        return isId;
      }
    };

    XMLElement.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.setIdAttributeNode = function(idAttr, isId) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByTagName = function(tagname) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByClassName = function(classNames) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.isEqualNode = function(node) {
      var i, j, ref1;
      if (!XMLElement.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
        return false;
      }
      if (node.namespaceURI !== this.namespaceURI) {
        return false;
      }
      if (node.prefix !== this.prefix) {
        return false;
      }
      if (node.localName !== this.localName) {
        return false;
      }
      if (node.attribs.length !== this.attribs.length) {
        return false;
      }
      for (i = j = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
        if (!this.attribs[i].isEqualNode(node.attribs[i])) {
          return false;
        }
      }
      return true;
    };

    return XMLElement;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 4361:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNamedNodeMap;

  module.exports = XMLNamedNodeMap = (function() {
    function XMLNamedNodeMap(nodes) {
      this.nodes = nodes;
    }

    Object.defineProperty(XMLNamedNodeMap.prototype, 'length', {
      get: function() {
        return Object.keys(this.nodes).length || 0;
      }
    });

    XMLNamedNodeMap.prototype.clone = function() {
      return this.nodes = null;
    };

    XMLNamedNodeMap.prototype.getNamedItem = function(name) {
      return this.nodes[name];
    };

    XMLNamedNodeMap.prototype.setNamedItem = function(node) {
      var oldNode;
      oldNode = this.nodes[node.nodeName];
      this.nodes[node.nodeName] = node;
      return oldNode || null;
    };

    XMLNamedNodeMap.prototype.removeNamedItem = function(name) {
      var oldNode;
      oldNode = this.nodes[name];
      delete this.nodes[name];
      return oldNode || null;
    };

    XMLNamedNodeMap.prototype.item = function(index) {
      return this.nodes[Object.keys(this.nodes)[index]] || null;
    };

    XMLNamedNodeMap.prototype.getNamedItemNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLNamedNodeMap.prototype.setNamedItemNS = function(node) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLNamedNodeMap.prototype.removeNamedItemNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented.");
    };

    return XMLNamedNodeMap;

  })();

}).call(this);


/***/ }),

/***/ 7608:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref1,
    hasProp = {}.hasOwnProperty;

  ref1 = __nccwpck_require__(8229), isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;

  XMLElement = null;

  XMLCData = null;

  XMLComment = null;

  XMLDeclaration = null;

  XMLDocType = null;

  XMLRaw = null;

  XMLText = null;

  XMLProcessingInstruction = null;

  XMLDummy = null;

  NodeType = null;

  XMLNodeList = null;

  XMLNamedNodeMap = null;

  DocumentPosition = null;

  module.exports = XMLNode = (function() {
    function XMLNode(parent1) {
      this.parent = parent1;
      if (this.parent) {
        this.options = this.parent.options;
        this.stringify = this.parent.stringify;
      }
      this.value = null;
      this.children = [];
      this.baseURI = null;
      if (!XMLElement) {
        XMLElement = __nccwpck_require__(9437);
        XMLCData = __nccwpck_require__(333);
        XMLComment = __nccwpck_require__(4407);
        XMLDeclaration = __nccwpck_require__(6364);
        XMLDocType = __nccwpck_require__(1801);
        XMLRaw = __nccwpck_require__(6329);
        XMLText = __nccwpck_require__(1318);
        XMLProcessingInstruction = __nccwpck_require__(6939);
        XMLDummy = __nccwpck_require__(3590);
        NodeType = __nccwpck_require__(9267);
        XMLNodeList = __nccwpck_require__(6768);
        XMLNamedNodeMap = __nccwpck_require__(4361);
        DocumentPosition = __nccwpck_require__(2839);
      }
    }

    Object.defineProperty(XMLNode.prototype, 'nodeName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nodeType', {
      get: function() {
        return this.type;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nodeValue', {
      get: function() {
        return this.value;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'parentNode', {
      get: function() {
        return this.parent;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'childNodes', {
      get: function() {
        if (!this.childNodeList || !this.childNodeList.nodes) {
          this.childNodeList = new XMLNodeList(this.children);
        }
        return this.childNodeList;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'firstChild', {
      get: function() {
        return this.children[0] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'lastChild', {
      get: function() {
        return this.children[this.children.length - 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'previousSibling', {
      get: function() {
        var i;
        i = this.parent.children.indexOf(this);
        return this.parent.children[i - 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nextSibling', {
      get: function() {
        var i;
        i = this.parent.children.indexOf(this);
        return this.parent.children[i + 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'ownerDocument', {
      get: function() {
        return this.document() || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'textContent', {
      get: function() {
        var child, j, len, ref2, str;
        if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
          str = '';
          ref2 = this.children;
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            if (child.textContent) {
              str += child.textContent;
            }
          }
          return str;
        } else {
          return null;
        }
      },
      set: function(value) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    XMLNode.prototype.setParent = function(parent) {
      var child, j, len, ref2, results;
      this.parent = parent;
      if (parent) {
        this.options = parent.options;
        this.stringify = parent.stringify;
      }
      ref2 = this.children;
      results = [];
      for (j = 0, len = ref2.length; j < len; j++) {
        child = ref2[j];
        results.push(child.setParent(this));
      }
      return results;
    };

    XMLNode.prototype.element = function(name, attributes, text) {
      var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
      lastChild = null;
      if (attributes === null && (text == null)) {
        ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
      }
      if (attributes == null) {
        attributes = {};
      }
      attributes = getValue(attributes);
      if (!isObject(attributes)) {
        ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
      }
      if (name != null) {
        name = getValue(name);
      }
      if (Array.isArray(name)) {
        for (j = 0, len = name.length; j < len; j++) {
          item = name[j];
          lastChild = this.element(item);
        }
      } else if (isFunction(name)) {
        lastChild = this.element(name.apply());
      } else if (isObject(name)) {
        for (key in name) {
          if (!hasProp.call(name, key)) continue;
          val = name[key];
          if (isFunction(val)) {
            val = val.apply();
          }
          if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
            lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
          } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
            lastChild = this.dummy();
          } else if (isObject(val) && isEmpty(val)) {
            lastChild = this.element(key);
          } else if (!this.options.keepNullNodes && (val == null)) {
            lastChild = this.dummy();
          } else if (!this.options.separateArrayItems && Array.isArray(val)) {
            for (k = 0, len1 = val.length; k < len1; k++) {
              item = val[k];
              childNode = {};
              childNode[key] = item;
              lastChild = this.element(childNode);
            }
          } else if (isObject(val)) {
            if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
              lastChild = this.element(val);
            } else {
              lastChild = this.element(key);
              lastChild.element(val);
            }
          } else {
            lastChild = this.element(key, val);
          }
        }
      } else if (!this.options.keepNullNodes && text === null) {
        lastChild = this.dummy();
      } else {
        if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
          lastChild = this.text(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
          lastChild = this.cdata(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
          lastChild = this.comment(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
          lastChild = this.raw(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
          lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
        } else {
          lastChild = this.node(name, attributes, text);
        }
      }
      if (lastChild == null) {
        throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
      }
      return lastChild;
    };

    XMLNode.prototype.insertBefore = function(name, attributes, text) {
      var child, i, newChild, refChild, removed;
      if (name != null ? name.type : void 0) {
        newChild = name;
        refChild = attributes;
        newChild.setParent(this);
        if (refChild) {
          i = children.indexOf(refChild);
          removed = children.splice(i);
          children.push(newChild);
          Array.prototype.push.apply(children, removed);
        } else {
          children.push(newChild);
        }
        return newChild;
      } else {
        if (this.isRoot) {
          throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
        }
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i);
        child = this.parent.element(name, attributes, text);
        Array.prototype.push.apply(this.parent.children, removed);
        return child;
      }
    };

    XMLNode.prototype.insertAfter = function(name, attributes, text) {
      var child, i, removed;
      if (this.isRoot) {
        throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
      }
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.element(name, attributes, text);
      Array.prototype.push.apply(this.parent.children, removed);
      return child;
    };

    XMLNode.prototype.remove = function() {
      var i, ref2;
      if (this.isRoot) {
        throw new Error("Cannot remove the root element. " + this.debugInfo());
      }
      i = this.parent.children.indexOf(this);
      [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref2 = [])), ref2;
      return this.parent;
    };

    XMLNode.prototype.node = function(name, attributes, text) {
      var child, ref2;
      if (name != null) {
        name = getValue(name);
      }
      attributes || (attributes = {});
      attributes = getValue(attributes);
      if (!isObject(attributes)) {
        ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
      }
      child = new XMLElement(this, name, attributes);
      if (text != null) {
        child.text(text);
      }
      this.children.push(child);
      return child;
    };

    XMLNode.prototype.text = function(value) {
      var child;
      if (isObject(value)) {
        this.element(value);
      }
      child = new XMLText(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.cdata = function(value) {
      var child;
      child = new XMLCData(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.comment = function(value) {
      var child;
      child = new XMLComment(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.commentBefore = function(value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.comment(value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.commentAfter = function(value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.comment(value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.raw = function(value) {
      var child;
      child = new XMLRaw(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.dummy = function() {
      var child;
      child = new XMLDummy(this);
      return child;
    };

    XMLNode.prototype.instruction = function(target, value) {
      var insTarget, insValue, instruction, j, len;
      if (target != null) {
        target = getValue(target);
      }
      if (value != null) {
        value = getValue(value);
      }
      if (Array.isArray(target)) {
        for (j = 0, len = target.length; j < len; j++) {
          insTarget = target[j];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        instruction = new XMLProcessingInstruction(this, target, value);
        this.children.push(instruction);
      }
      return this;
    };

    XMLNode.prototype.instructionBefore = function(target, value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.instruction(target, value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.instructionAfter = function(target, value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.instruction(target, value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.declaration = function(version, encoding, standalone) {
      var doc, xmldec;
      doc = this.document();
      xmldec = new XMLDeclaration(doc, version, encoding, standalone);
      if (doc.children.length === 0) {
        doc.children.unshift(xmldec);
      } else if (doc.children[0].type === NodeType.Declaration) {
        doc.children[0] = xmldec;
      } else {
        doc.children.unshift(xmldec);
      }
      return doc.root() || doc;
    };

    XMLNode.prototype.dtd = function(pubID, sysID) {
      var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
      doc = this.document();
      doctype = new XMLDocType(doc, pubID, sysID);
      ref2 = doc.children;
      for (i = j = 0, len = ref2.length; j < len; i = ++j) {
        child = ref2[i];
        if (child.type === NodeType.DocType) {
          doc.children[i] = doctype;
          return doctype;
        }
      }
      ref3 = doc.children;
      for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
        child = ref3[i];
        if (child.isRoot) {
          doc.children.splice(i, 0, doctype);
          return doctype;
        }
      }
      doc.children.push(doctype);
      return doctype;
    };

    XMLNode.prototype.up = function() {
      if (this.isRoot) {
        throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
      }
      return this.parent;
    };

    XMLNode.prototype.root = function() {
      var node;
      node = this;
      while (node) {
        if (node.type === NodeType.Document) {
          return node.rootObject;
        } else if (node.isRoot) {
          return node;
        } else {
          node = node.parent;
        }
      }
    };

    XMLNode.prototype.document = function() {
      var node;
      node = this;
      while (node) {
        if (node.type === NodeType.Document) {
          return node;
        } else {
          node = node.parent;
        }
      }
    };

    XMLNode.prototype.end = function(options) {
      return this.document().end(options);
    };

    XMLNode.prototype.prev = function() {
      var i;
      i = this.parent.children.indexOf(this);
      if (i < 1) {
        throw new Error("Already at the first node. " + this.debugInfo());
      }
      return this.parent.children[i - 1];
    };

    XMLNode.prototype.next = function() {
      var i;
      i = this.parent.children.indexOf(this);
      if (i === -1 || i === this.parent.children.length - 1) {
        throw new Error("Already at the last node. " + this.debugInfo());
      }
      return this.parent.children[i + 1];
    };

    XMLNode.prototype.importDocument = function(doc) {
      var clonedRoot;
      clonedRoot = doc.root().clone();
      clonedRoot.parent = this;
      clonedRoot.isRoot = false;
      this.children.push(clonedRoot);
      return this;
    };

    XMLNode.prototype.debugInfo = function(name) {
      var ref2, ref3;
      name = name || this.name;
      if ((name == null) && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
        return "";
      } else if (name == null) {
        return "parent: <" + this.parent.name + ">";
      } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
        return "node: <" + name + ">";
      } else {
        return "node: <" + name + ">, parent: <" + this.parent.name + ">";
      }
    };

    XMLNode.prototype.ele = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLNode.prototype.doc = function() {
      return this.document();
    };

    XMLNode.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLNode.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.t = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLNode.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    XMLNode.prototype.u = function() {
      return this.up();
    };

    XMLNode.prototype.importXMLBuilder = function(doc) {
      return this.importDocument(doc);
    };

    XMLNode.prototype.replaceChild = function(newChild, oldChild) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.removeChild = function(oldChild) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.appendChild = function(newChild) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.hasChildNodes = function() {
      return this.children.length !== 0;
    };

    XMLNode.prototype.cloneNode = function(deep) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.normalize = function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.isSupported = function(feature, version) {
      return true;
    };

    XMLNode.prototype.hasAttributes = function() {
      return this.attribs.length !== 0;
    };

    XMLNode.prototype.compareDocumentPosition = function(other) {
      var ref, res;
      ref = this;
      if (ref === other) {
        return 0;
      } else if (this.document() !== other.document()) {
        res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
        if (Math.random() < 0.5) {
          res |= DocumentPosition.Preceding;
        } else {
          res |= DocumentPosition.Following;
        }
        return res;
      } else if (ref.isAncestor(other)) {
        return DocumentPosition.Contains | DocumentPosition.Preceding;
      } else if (ref.isDescendant(other)) {
        return DocumentPosition.Contains | DocumentPosition.Following;
      } else if (ref.isPreceding(other)) {
        return DocumentPosition.Preceding;
      } else {
        return DocumentPosition.Following;
      }
    };

    XMLNode.prototype.isSameNode = function(other) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.lookupPrefix = function(namespaceURI) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.isDefaultNamespace = function(namespaceURI) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.lookupNamespaceURI = function(prefix) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.isEqualNode = function(node) {
      var i, j, ref2;
      if (node.nodeType !== this.nodeType) {
        return false;
      }
      if (node.children.length !== this.children.length) {
        return false;
      }
      for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
        if (!this.children[i].isEqualNode(node.children[i])) {
          return false;
        }
      }
      return true;
    };

    XMLNode.prototype.getFeature = function(feature, version) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.setUserData = function(key, data, handler) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.getUserData = function(key) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.contains = function(other) {
      if (!other) {
        return false;
      }
      return other === this || this.isDescendant(other);
    };

    XMLNode.prototype.isDescendant = function(node) {
      var child, isDescendantChild, j, len, ref2;
      ref2 = this.children;
      for (j = 0, len = ref2.length; j < len; j++) {
        child = ref2[j];
        if (node === child) {
          return true;
        }
        isDescendantChild = child.isDescendant(node);
        if (isDescendantChild) {
          return true;
        }
      }
      return false;
    };

    XMLNode.prototype.isAncestor = function(node) {
      return node.isDescendant(this);
    };

    XMLNode.prototype.isPreceding = function(node) {
      var nodePos, thisPos;
      nodePos = this.treePosition(node);
      thisPos = this.treePosition(this);
      if (nodePos === -1 || thisPos === -1) {
        return false;
      } else {
        return nodePos < thisPos;
      }
    };

    XMLNode.prototype.isFollowing = function(node) {
      var nodePos, thisPos;
      nodePos = this.treePosition(node);
      thisPos = this.treePosition(this);
      if (nodePos === -1 || thisPos === -1) {
        return false;
      } else {
        return nodePos > thisPos;
      }
    };

    XMLNode.prototype.treePosition = function(node) {
      var found, pos;
      pos = 0;
      found = false;
      this.foreachTreeNode(this.document(), function(childNode) {
        pos++;
        if (!found && childNode === node) {
          return found = true;
        }
      });
      if (found) {
        return pos;
      } else {
        return -1;
      }
    };

    XMLNode.prototype.foreachTreeNode = function(node, func) {
      var child, j, len, ref2, res;
      node || (node = this.document());
      ref2 = node.children;
      for (j = 0, len = ref2.length; j < len; j++) {
        child = ref2[j];
        if (res = func(child)) {
          return res;
        } else {
          res = this.foreachTreeNode(child, func);
          if (res) {
            return res;
          }
        }
      }
    };

    return XMLNode;

  })();

}).call(this);


/***/ }),

/***/ 6768:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNodeList;

  module.exports = XMLNodeList = (function() {
    function XMLNodeList(nodes) {
      this.nodes = nodes;
    }

    Object.defineProperty(XMLNodeList.prototype, 'length', {
      get: function() {
        return this.nodes.length || 0;
      }
    });

    XMLNodeList.prototype.clone = function() {
      return this.nodes = null;
    };

    XMLNodeList.prototype.item = function(index) {
      return this.nodes[index] || null;
    };

    return XMLNodeList;

  })();

}).call(this);


/***/ }),

/***/ 6939:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLCharacterData, XMLProcessingInstruction,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __nccwpck_require__(9267);

  XMLCharacterData = __nccwpck_require__(7709);

  module.exports = XMLProcessingInstruction = (function(superClass) {
    extend(XMLProcessingInstruction, superClass);

    function XMLProcessingInstruction(parent, target, value) {
      XMLProcessingInstruction.__super__.constructor.call(this, parent);
      if (target == null) {
        throw new Error("Missing instruction target. " + this.debugInfo());
      }
      this.type = NodeType.ProcessingInstruction;
      this.target = this.stringify.insTarget(target);
      this.name = this.target;
      if (value) {
        this.value = this.stringify.insValue(value);
      }
    }

    XMLProcessingInstruction.prototype.clone = function() {
      return Object.create(this);
    };

    XMLProcessingInstruction.prototype.toString = function(options) {
      return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
    };

    XMLProcessingInstruction.prototype.isEqualNode = function(node) {
      if (!XMLProcessingInstruction.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
        return false;
      }
      if (node.target !== this.target) {
        return false;
      }
      return true;
    };

    return XMLProcessingInstruction;

  })(XMLCharacterData);

}).call(this);


/***/ }),

/***/ 6329:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLNode, XMLRaw,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __nccwpck_require__(9267);

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLRaw = (function(superClass) {
    extend(XMLRaw, superClass);

    function XMLRaw(parent, text) {
      XMLRaw.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing raw text. " + this.debugInfo());
      }
      this.type = NodeType.Raw;
      this.value = this.stringify.raw(text);
    }

    XMLRaw.prototype.clone = function() {
      return Object.create(this);
    };

    XMLRaw.prototype.toString = function(options) {
      return this.options.writer.raw(this, this.options.writer.filterOptions(options));
    };

    return XMLRaw;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 8601:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, WriterState, XMLStreamWriter, XMLWriterBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __nccwpck_require__(9267);

  XMLWriterBase = __nccwpck_require__(6752);

  WriterState = __nccwpck_require__(9766);

  module.exports = XMLStreamWriter = (function(superClass) {
    extend(XMLStreamWriter, superClass);

    function XMLStreamWriter(stream, options) {
      this.stream = stream;
      XMLStreamWriter.__super__.constructor.call(this, options);
    }

    XMLStreamWriter.prototype.endline = function(node, options, level) {
      if (node.isLastRootNode && options.state === WriterState.CloseTag) {
        return '';
      } else {
        return XMLStreamWriter.__super__.endline.call(this, node, options, level);
      }
    };

    XMLStreamWriter.prototype.document = function(doc, options) {
      var child, i, j, k, len, len1, ref, ref1, results;
      ref = doc.children;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        child = ref[i];
        child.isLastRootNode = i === doc.children.length - 1;
      }
      options = this.filterOptions(options);
      ref1 = doc.children;
      results = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        child = ref1[k];
        results.push(this.writeChildNode(child, options, 0));
      }
      return results;
    };

    XMLStreamWriter.prototype.attribute = function(att, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.attribute.call(this, att, options, level));
    };

    XMLStreamWriter.prototype.cdata = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.cdata.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.comment = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.comment.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.declaration = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.declaration.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.docType = function(node, options, level) {
      var child, j, len, ref;
      level || (level = 0);
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      this.stream.write(this.indent(node, options, level));
      this.stream.write('<!DOCTYPE ' + node.root().name);
      if (node.pubID && node.sysID) {
        this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
      } else if (node.sysID) {
        this.stream.write(' SYSTEM "' + node.sysID + '"');
      }
      if (node.children.length > 0) {
        this.stream.write(' [');
        this.stream.write(this.endline(node, options, level));
        options.state = WriterState.InsideTag;
        ref = node.children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        this.stream.write(']');
      }
      options.state = WriterState.CloseTag;
      this.stream.write(options.spaceBeforeSlash + '>');
      this.stream.write(this.endline(node, options, level));
      options.state = WriterState.None;
      return this.closeNode(node, options, level);
    };

    XMLStreamWriter.prototype.element = function(node, options, level) {
      var att, child, childNodeCount, firstChildNode, j, len, name, prettySuppressed, ref, ref1;
      level || (level = 0);
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      this.stream.write(this.indent(node, options, level) + '<' + node.name);
      ref = node.attribs;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        att = ref[name];
        this.attribute(att, options, level);
      }
      childNodeCount = node.children.length;
      firstChildNode = childNodeCount === 0 ? null : node.children[0];
      if (childNodeCount === 0 || node.children.every(function(e) {
        return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === '';
      })) {
        if (options.allowEmpty) {
          this.stream.write('>');
          options.state = WriterState.CloseTag;
          this.stream.write('</' + node.name + '>');
        } else {
          options.state = WriterState.CloseTag;
          this.stream.write(options.spaceBeforeSlash + '/>');
        }
      } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && (firstChildNode.value != null)) {
        this.stream.write('>');
        options.state = WriterState.InsideTag;
        options.suppressPrettyCount++;
        prettySuppressed = true;
        this.writeChildNode(firstChildNode, options, level + 1);
        options.suppressPrettyCount--;
        prettySuppressed = false;
        options.state = WriterState.CloseTag;
        this.stream.write('</' + node.name + '>');
      } else {
        this.stream.write('>' + this.endline(node, options, level));
        options.state = WriterState.InsideTag;
        ref1 = node.children;
        for (j = 0, len = ref1.length; j < len; j++) {
          child = ref1[j];
          this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        this.stream.write(this.indent(node, options, level) + '</' + node.name + '>');
      }
      this.stream.write(this.endline(node, options, level));
      options.state = WriterState.None;
      return this.closeNode(node, options, level);
    };

    XMLStreamWriter.prototype.processingInstruction = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.processingInstruction.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.raw = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.raw.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.text = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.text.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.dtdAttList = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.dtdAttList.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.dtdElement = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.dtdElement.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.dtdEntity = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.dtdEntity.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.dtdNotation = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.dtdNotation.call(this, node, options, level));
    };

    return XMLStreamWriter;

  })(XMLWriterBase);

}).call(this);


/***/ }),

/***/ 5913:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLStringWriter, XMLWriterBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLWriterBase = __nccwpck_require__(6752);

  module.exports = XMLStringWriter = (function(superClass) {
    extend(XMLStringWriter, superClass);

    function XMLStringWriter(options) {
      XMLStringWriter.__super__.constructor.call(this, options);
    }

    XMLStringWriter.prototype.document = function(doc, options) {
      var child, i, len, r, ref;
      options = this.filterOptions(options);
      r = '';
      ref = doc.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        r += this.writeChildNode(child, options, 0);
      }
      if (options.pretty && r.slice(-options.newline.length) === options.newline) {
        r = r.slice(0, -options.newline.length);
      }
      return r;
    };

    return XMLStringWriter;

  })(XMLWriterBase);

}).call(this);


/***/ }),

/***/ 8594:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLStringifier,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    hasProp = {}.hasOwnProperty;

  module.exports = XMLStringifier = (function() {
    function XMLStringifier(options) {
      this.assertLegalName = bind(this.assertLegalName, this);
      this.assertLegalChar = bind(this.assertLegalChar, this);
      var key, ref, value;
      options || (options = {});
      this.options = options;
      if (!this.options.version) {
        this.options.version = '1.0';
      }
      ref = options.stringify || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this[key] = value;
      }
    }

    XMLStringifier.prototype.name = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalName('' + val || '');
    };

    XMLStringifier.prototype.text = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar(this.textEscape('' + val || ''));
    };

    XMLStringifier.prototype.cdata = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      val = val.replace(']]>', ']]]]><![CDATA[>');
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.comment = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      if (val.match(/--/)) {
        throw new Error("Comment text cannot contain double-hypen: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.raw = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return '' + val || '';
    };

    XMLStringifier.prototype.attValue = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar(this.attEscape(val = '' + val || ''));
    };

    XMLStringifier.prototype.insTarget = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.insValue = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      if (val.match(/\?>/)) {
        throw new Error("Invalid processing instruction value: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.xmlVersion = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      if (!val.match(/1\.[0-9]+/)) {
        throw new Error("Invalid version number: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlEncoding = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
        throw new Error("Invalid encoding: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.xmlStandalone = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      if (val) {
        return "yes";
      } else {
        return "no";
      }
    };

    XMLStringifier.prototype.dtdPubID = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdSysID = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdElementValue = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdAttType = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdAttDefault = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdEntityValue = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdNData = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.convertAttKey = '@';

    XMLStringifier.prototype.convertPIKey = '?';

    XMLStringifier.prototype.convertTextKey = '#text';

    XMLStringifier.prototype.convertCDataKey = '#cdata';

    XMLStringifier.prototype.convertCommentKey = '#comment';

    XMLStringifier.prototype.convertRawKey = '#raw';

    XMLStringifier.prototype.assertLegalChar = function(str) {
      var regex, res;
      if (this.options.noValidation) {
        return str;
      }
      regex = '';
      if (this.options.version === '1.0') {
        regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
        if (res = str.match(regex)) {
          throw new Error("Invalid character in string: " + str + " at index " + res.index);
        }
      } else if (this.options.version === '1.1') {
        regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
        if (res = str.match(regex)) {
          throw new Error("Invalid character in string: " + str + " at index " + res.index);
        }
      }
      return str;
    };

    XMLStringifier.prototype.assertLegalName = function(str) {
      var regex;
      if (this.options.noValidation) {
        return str;
      }
      this.assertLegalChar(str);
      regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
      if (!str.match(regex)) {
        throw new Error("Invalid character in name");
      }
      return str;
    };

    XMLStringifier.prototype.textEscape = function(str) {
      var ampregex;
      if (this.options.noValidation) {
        return str;
      }
      ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
      return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
    };

    XMLStringifier.prototype.attEscape = function(str) {
      var ampregex;
      if (this.options.noValidation) {
        return str;
      }
      ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
      return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
    };

    return XMLStringifier;

  })();

}).call(this);


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLCharacterData, XMLText,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __nccwpck_require__(9267);

  XMLCharacterData = __nccwpck_require__(7709);

  module.exports = XMLText = (function(superClass) {
    extend(XMLText, superClass);

    function XMLText(parent, text) {
      XMLText.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing element text. " + this.debugInfo());
      }
      this.name = "#text";
      this.type = NodeType.Text;
      this.value = this.stringify.text(text);
    }

    Object.defineProperty(XMLText.prototype, 'isElementContentWhitespace', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLText.prototype, 'wholeText', {
      get: function() {
        var next, prev, str;
        str = '';
        prev = this.previousSibling;
        while (prev) {
          str = prev.data + str;
          prev = prev.previousSibling;
        }
        str += this.data;
        next = this.nextSibling;
        while (next) {
          str = str + next.data;
          next = next.nextSibling;
        }
        return str;
      }
    });

    XMLText.prototype.clone = function() {
      return Object.create(this);
    };

    XMLText.prototype.toString = function(options) {
      return this.options.writer.text(this, this.options.writer.filterOptions(options));
    };

    XMLText.prototype.splitText = function(offset) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLText.prototype.replaceWholeText = function(content) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    return XMLText;

  })(XMLCharacterData);

}).call(this);


/***/ }),

/***/ 6752:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign,
    hasProp = {}.hasOwnProperty;

  assign = (__nccwpck_require__(8229).assign);

  NodeType = __nccwpck_require__(9267);

  XMLDeclaration = __nccwpck_require__(6364);

  XMLDocType = __nccwpck_require__(1801);

  XMLCData = __nccwpck_require__(333);

  XMLComment = __nccwpck_require__(4407);

  XMLElement = __nccwpck_require__(9437);

  XMLRaw = __nccwpck_require__(6329);

  XMLText = __nccwpck_require__(1318);

  XMLProcessingInstruction = __nccwpck_require__(6939);

  XMLDummy = __nccwpck_require__(3590);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDNotation = __nccwpck_require__(2837);

  WriterState = __nccwpck_require__(9766);

  module.exports = XMLWriterBase = (function() {
    function XMLWriterBase(options) {
      var key, ref, value;
      options || (options = {});
      this.options = options;
      ref = options.writer || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this["_" + key] = this[key];
        this[key] = value;
      }
    }

    XMLWriterBase.prototype.filterOptions = function(options) {
      var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
      options || (options = {});
      options = assign({}, this.options, options);
      filteredOptions = {
        writer: this
      };
      filteredOptions.pretty = options.pretty || false;
      filteredOptions.allowEmpty = options.allowEmpty || false;
      filteredOptions.indent = (ref = options.indent) != null ? ref : '  ';
      filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : '\n';
      filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
      filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
      filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : '';
      if (filteredOptions.spaceBeforeSlash === true) {
        filteredOptions.spaceBeforeSlash = ' ';
      }
      filteredOptions.suppressPrettyCount = 0;
      filteredOptions.user = {};
      filteredOptions.state = WriterState.None;
      return filteredOptions;
    };

    XMLWriterBase.prototype.indent = function(node, options, level) {
      var indentLevel;
      if (!options.pretty || options.suppressPrettyCount) {
        return '';
      } else if (options.pretty) {
        indentLevel = (level || 0) + options.offset + 1;
        if (indentLevel > 0) {
          return new Array(indentLevel).join(options.indent);
        }
      }
      return '';
    };

    XMLWriterBase.prototype.endline = function(node, options, level) {
      if (!options.pretty || options.suppressPrettyCount) {
        return '';
      } else {
        return options.newline;
      }
    };

    XMLWriterBase.prototype.attribute = function(att, options, level) {
      var r;
      this.openAttribute(att, options, level);
      r = ' ' + att.name + '="' + att.value + '"';
      this.closeAttribute(att, options, level);
      return r;
    };

    XMLWriterBase.prototype.cdata = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<![CDATA[';
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += ']]>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.comment = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!-- ';
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += ' -->' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.declaration = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<?xml';
      options.state = WriterState.InsideTag;
      r += ' version="' + node.version + '"';
      if (node.encoding != null) {
        r += ' encoding="' + node.encoding + '"';
      }
      if (node.standalone != null) {
        r += ' standalone="' + node.standalone + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '?>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.docType = function(node, options, level) {
      var child, i, len, r, ref;
      level || (level = 0);
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      r += '<!DOCTYPE ' + node.root().name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      if (node.children.length > 0) {
        r += ' [';
        r += this.endline(node, options, level);
        options.state = WriterState.InsideTag;
        ref = node.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          r += this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        r += ']';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.element = function(node, options, level) {
      var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
      level || (level = 0);
      prettySuppressed = false;
      r = '';
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r += this.indent(node, options, level) + '<' + node.name;
      ref = node.attribs;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        att = ref[name];
        r += this.attribute(att, options, level);
      }
      childNodeCount = node.children.length;
      firstChildNode = childNodeCount === 0 ? null : node.children[0];
      if (childNodeCount === 0 || node.children.every(function(e) {
        return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === '';
      })) {
        if (options.allowEmpty) {
          r += '>';
          options.state = WriterState.CloseTag;
          r += '</' + node.name + '>' + this.endline(node, options, level);
        } else {
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + '/>' + this.endline(node, options, level);
        }
      } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && (firstChildNode.value != null)) {
        r += '>';
        options.state = WriterState.InsideTag;
        options.suppressPrettyCount++;
        prettySuppressed = true;
        r += this.writeChildNode(firstChildNode, options, level + 1);
        options.suppressPrettyCount--;
        prettySuppressed = false;
        options.state = WriterState.CloseTag;
        r += '</' + node.name + '>' + this.endline(node, options, level);
      } else {
        if (options.dontPrettyTextNodes) {
          ref1 = node.children;
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            if ((child.type === NodeType.Text || child.type === NodeType.Raw) && (child.value != null)) {
              options.suppressPrettyCount++;
              prettySuppressed = true;
              break;
            }
          }
        }
        r += '>' + this.endline(node, options, level);
        options.state = WriterState.InsideTag;
        ref2 = node.children;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          child = ref2[j];
          r += this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        r += this.indent(node, options, level) + '</' + node.name + '>';
        if (prettySuppressed) {
          options.suppressPrettyCount--;
        }
        r += this.endline(node, options, level);
        options.state = WriterState.None;
      }
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.writeChildNode = function(node, options, level) {
      switch (node.type) {
        case NodeType.CData:
          return this.cdata(node, options, level);
        case NodeType.Comment:
          return this.comment(node, options, level);
        case NodeType.Element:
          return this.element(node, options, level);
        case NodeType.Raw:
          return this.raw(node, options, level);
        case NodeType.Text:
          return this.text(node, options, level);
        case NodeType.ProcessingInstruction:
          return this.processingInstruction(node, options, level);
        case NodeType.Dummy:
          return '';
        case NodeType.Declaration:
          return this.declaration(node, options, level);
        case NodeType.DocType:
          return this.docType(node, options, level);
        case NodeType.AttributeDeclaration:
          return this.dtdAttList(node, options, level);
        case NodeType.ElementDeclaration:
          return this.dtdElement(node, options, level);
        case NodeType.EntityDeclaration:
          return this.dtdEntity(node, options, level);
        case NodeType.NotationDeclaration:
          return this.dtdNotation(node, options, level);
        default:
          throw new Error("Unknown XML node type: " + node.constructor.name);
      }
    };

    XMLWriterBase.prototype.processingInstruction = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<?';
      options.state = WriterState.InsideTag;
      r += node.target;
      if (node.value) {
        r += ' ' + node.value;
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '?>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.raw = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.text = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.dtdAttList = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ATTLIST';
      options.state = WriterState.InsideTag;
      r += ' ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType;
      if (node.defaultValueType !== '#DEFAULT') {
        r += ' ' + node.defaultValueType;
      }
      if (node.defaultValue) {
        r += ' "' + node.defaultValue + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.dtdElement = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ELEMENT';
      options.state = WriterState.InsideTag;
      r += ' ' + node.name + ' ' + node.value;
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.dtdEntity = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ENTITY';
      options.state = WriterState.InsideTag;
      if (node.pe) {
        r += ' %';
      }
      r += ' ' + node.name;
      if (node.value) {
        r += ' "' + node.value + '"';
      } else {
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        if (node.nData) {
          r += ' NDATA ' + node.nData;
        }
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.dtdNotation = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!NOTATION';
      options.state = WriterState.InsideTag;
      r += ' ' + node.name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.pubID) {
        r += ' PUBLIC "' + node.pubID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.openNode = function(node, options, level) {};

    XMLWriterBase.prototype.closeNode = function(node, options, level) {};

    XMLWriterBase.prototype.openAttribute = function(att, options, level) {};

    XMLWriterBase.prototype.closeAttribute = function(att, options, level) {};

    return XMLWriterBase;

  })();

}).call(this);


/***/ }),

/***/ 2958:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;

  ref = __nccwpck_require__(8229), assign = ref.assign, isFunction = ref.isFunction;

  XMLDOMImplementation = __nccwpck_require__(8310);

  XMLDocument = __nccwpck_require__(3730);

  XMLDocumentCB = __nccwpck_require__(7356);

  XMLStringWriter = __nccwpck_require__(5913);

  XMLStreamWriter = __nccwpck_require__(8601);

  NodeType = __nccwpck_require__(9267);

  WriterState = __nccwpck_require__(9766);

  module.exports.create = function(name, xmldec, doctype, options) {
    var doc, root;
    if (name == null) {
      throw new Error("Root element needs a name.");
    }
    options = assign({}, xmldec, doctype, options);
    doc = new XMLDocument(options);
    root = doc.element(name);
    if (!options.headless) {
      doc.declaration(options);
      if ((options.pubID != null) || (options.sysID != null)) {
        doc.dtd(options);
      }
    }
    return root;
  };

  module.exports.begin = function(options, onData, onEnd) {
    var ref1;
    if (isFunction(options)) {
      ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
      options = {};
    }
    if (onData) {
      return new XMLDocumentCB(options, onData, onEnd);
    } else {
      return new XMLDocument(options);
    }
  };

  module.exports.stringWriter = function(options) {
    return new XMLStringWriter(options);
  };

  module.exports.streamWriter = function(stream, options) {
    return new XMLStreamWriter(stream, options);
  };

  module.exports.implementation = new XMLDOMImplementation();

  module.exports.nodeType = NodeType;

  module.exports.writerState = WriterState;

}).call(this);


/***/ }),

/***/ 6144:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const sts20150401_1 = __importStar(__nccwpck_require__(7234));
const openapi = __importStar(__nccwpck_require__(6642));
const credentials_1 = __importStar(__nccwpck_require__(4060));
const teaUtil = __importStar(__nccwpck_require__(1979));
const actions_utils_1 = __nccwpck_require__(308);
const utils = __importStar(__nccwpck_require__(1314));
function assumeRole(region, roleArn, oidcArn, oidcToken, durationSeconds, sessionName) {
    return __awaiter(this, void 0, void 0, function* () {
        const cred = new credentials_1.default(new credentials_1.Config({
            type: 'access_key',
            accessKeyId: 'xxx',
            accessKeySecret: 'xxx',
        }));
        const conf = new openapi.Config({
            cred: cred,
            regionId: region,
            protocol: 'https',
        });
        const client = new sts20150401_1.default(conf);
        const req = new sts20150401_1.AssumeRoleWithOIDCRequest({
            durationSeconds: durationSeconds,
            OIDCProviderArn: oidcArn,
            OIDCToken: oidcToken,
            roleArn: roleArn,
            roleSessionName: sessionName,
        });
        const opts = new teaUtil.RuntimeOptions({
            connectTimeout: 5000,
            readTimeout: 5000,
        });
        return client.assumeRoleWithOIDCWithOptions(req, opts).then(function (data) {
            return {
                // @ts-ignore
                accessKeyId: data.body.credentials.accessKeyId,
                // @ts-ignore
                accessKeySecret: data.body.credentials.accessKeySecret,
                // @ts-ignore
                securityToken: data.body.credentials.securityToken,
            };
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const audience = core.getInput('audience', { required: false });
        const oidcToken = yield core.getIDToken(audience);
        const region = core.getInput('region', { required: false });
        const roleArn = core.getInput('role-arn-to-assume', { required: true });
        const oidcArn = core.getInput('oidc-provider-arn', { required: true });
        const durationSeconds = Number(core.getInput('role-duration-seconds', { required: false }));
        const sessionName = core.getInput('role-session-name', { required: false });
        const exportEnvs = core.getBooleanInput('export_environment_variables', { required: false });
        const { accessKeyId, accessKeySecret, securityToken } = yield assumeRole(region, roleArn, oidcArn, oidcToken, durationSeconds, sessionName);
        if (exportEnvs) {
            // @ts-ignore
            utils.exportEnvs(accessKeyId, accessKeySecret, securityToken);
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const retries = Number(core.getInput('retries', { required: false }));
        yield (0, actions_utils_1.withRetries)(main, {
            retries: retries,
            backoff: 300,
        })();
    });
}
run();


/***/ }),

/***/ 1314:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exportEnvs = void 0;
const core = __importStar(__nccwpck_require__(2186));
function exportEnvs(accessKeyId, accessKeySecret, securityToken) {
    core.setSecret(accessKeySecret);
    core.setSecret(securityToken);
    core.exportVariable('ALIBABA_CLOUD_ACCESS_KEY_ID', accessKeyId);
    core.exportVariable('ALICLOUD_ACCESS_KEY', accessKeyId);
    core.exportVariable('ALIBABACLOUD_ACCESS_KEY_ID', accessKeyId);
    core.exportVariable('ALIBABA_CLOUD_ACCESS_KEY_SECRET', accessKeyId);
    core.exportVariable('ALICLOUD_SECRET_KEY', accessKeySecret);
    core.exportVariable('ALICLOUD_SECRET_KEY', accessKeySecret);
    core.exportVariable('ALIBABACLOUD_ACCESS_KEY_SECRET', accessKeySecret);
    core.exportVariable('ALIBABA_CLOUD_SECURITY_TOKEN', securityToken);
    core.exportVariable('ALICLOUD_ACCESS_KEY_STS_TOKEN', securityToken);
    core.exportVariable('ALIBABACLOUD_SECURITY_TOKEN', securityToken);
}
exports.exportEnvs = exportEnvs;


/***/ }),

/***/ 132:
/***/ ((module) => {

module.exports = eval("require")("supports-color");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 3477:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 6224:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 4655:
/***/ ((module) => {

"use strict";
module.exports = require("v8");

/***/ }),

/***/ 9796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 9807:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@alicloud/credentials","version":"2.2.5","description":"alibaba cloud node.js sdk credentials","main":"dist/src/client.js","scripts":{"prepublishOnly":"tsc","build":"tsc","lint":"eslint --fix ./src --ext .ts","test":"mocha -b -r ts-node/register test/**/*.test.ts --timeout 15000","cov":"nyc -e .ts -r=html -r=text -r=lcov npm run test","ci":"npm run cov && codecov","test-integration":"mocha -b -r ts-node/register -R spec test/*.integration.ts","clean":"rm -rf coverage"},"repository":{"type":"git","url":"git+https://github.com/aliyun/nodejs-credentials.git"},"keywords":["alibaba cloud","sdk","credentials"],"author":"Alibaba Cloud SDK","license":"MIT","devDependencies":{"@types/expect.js":"^0.3.29","@types/ini":"^1.3.30","@types/mocha":"^7.0.1","@types/rewire":"^2.5.28","@typescript-eslint/eslint-plugin":"^4.31.2","@typescript-eslint/parser":"^4.31.2","codecov":"^3.1.0","eslint":"^7.32.0","expect.js":"^0.3.1","mm":"^2.4.1","mocha":"^10.1.0","nyc":"^13.1.0","rewire":"^4.0.1","ts-node":"^8.6.2","typescript":"^3.7.5"},"dependencies":{"@alicloud/tea-typescript":"^1.5.3","httpx":"^2.2.0","ini":"^1.3.5","kitx":"^2.0.0"},"bugs":{"url":"https://github.com/aliyun/nodejs-credentials/issues"},"homepage":"https://github.com/aliyun/nodejs-credentials#readme","files":["src","dist"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(6144);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map