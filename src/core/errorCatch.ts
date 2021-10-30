import { formatToDateTime } from '../utils/dateUtil'
import Vue from 'vue'

type Nullable<T> = T | null

enum ErrorTypeEnum {
    VUE = 'vue',
    SCRIPT = 'script',
    RESOURCE = 'resource',
    AJAX = 'ajax',
    PROMISE = 'promise'
}

interface IErrorLogInfo {
    type: ErrorTypeEnum
    file: string
    name?: string
    message: string
    stack?: string
    detail: string
    url: string
    time?: string
}

class ErrorCatch {
    private static errorLogInfoList: Nullable<IErrorLogInfo[]> = []
    private static instance: ErrorCatch

    public static create () {
        if (!ErrorCatch) {
            ErrorCatch.instance = new ErrorCatch()
        }
        return ErrorCatch.instance
    }

    public init () {
        Vue.config.errorHandler = ErrorCatch.vueErrorHandler
        window.onerror = ErrorCatch.scriptErrorHandler
        this.promiseErrorHandler()
        this.resourceErrorHandler()
    }

    /**
     * handle error stack information
     * @param error
     * @private
     */
    private static processStackMsg (error: Error) {
        if (!error.stack) return ''
        let stack = error.stack.replace(/\n/gi, '')
            .replace(/\bat\b/gi, '@')
            .split('@')
            .splice(0, 9)
            .map((v) => v.replace(/^\s*|\s*$/g, ''))
            .join('~')
            .replace(/\?[^:]+/gi, '')
        const msg = error.toString()
        if (stack.indexOf(msg) < 0) {
            stack = msg + '@' + stack
        }
        return stack
    }

    /**
     * get vue component name
     * @param vm
     * @private
     */
    private static formatComponentName (vm: any) {
        if (vm.$root === vm) {
            return {
                name: 'root',
                path: 'root'
            }
        }
        const options = vm.$options as Partial<any>
        if (!options) {
            return {
                name: 'anonymous',
                path: 'anonymous'
            }
        }
        const name = options.name || options._componentTag
        return {
            name: name,
            path: options.__file
        }
    }

    /**
     * Config vue error handler function
     * @private
     */
    private static vueErrorHandler (err: Error, vm: any, info: string) {
        const { name, path } = ErrorCatch.formatComponentName(vm)
        ErrorCatch.addErrorLogInfo({
            type: ErrorTypeEnum.VUE,
            name,
            file: path,
            message: err.message,
            stack: ErrorCatch.processStackMsg(err),
            detail: info,
            url: window.location.href
        })
    }

    /**
     * Configure script error handler function
     * @param event
     * @param source
     * @param lineno
     * @param colno
     * @param error
     * @private
     */
    private static scriptErrorHandler (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) {
        if (event === 'Script error.' && !source) {
            return false
        }
        const errorInfo: Partial<IErrorLogInfo> = {}
        colno = colno || (window.event && (window.event as any).errorCharacter) || 0
        errorInfo.message = event as string
        if (error?.stack) {
            errorInfo.stack = error.stack
        } else {
            errorInfo.stack = ''
        }
        const name = source ? source.substr(source.lastIndexOf('/') + 1) : 'script'
        ErrorCatch.addErrorLogInfo({
            type: ErrorTypeEnum.SCRIPT,
            name,
            file: source as any,
            detail: 'lineno' + lineno + ', colno' + colno,
            url: window.location.href,
            ...(errorInfo as Pick<IErrorLogInfo, 'message' | 'stack'>)
        })
        return true
    }

    /**
     * Promise error Handler function
     * @private
     */
    private promiseErrorHandler () {
        window.addEventListener('unhandledrejection', (event) => {
            ErrorCatch.addErrorLogInfo({
                type: ErrorTypeEnum.PROMISE,
                name: 'Promise Error!',
                file: 'none',
                detail: 'promise error!',
                url: window.location.href,
                stack: 'promise error!',
                message: event.reason
            })
        }, true)
    }

    /**
     * monitoring resource loading error handler function
     * @private
     */
    private resourceErrorHandler () {
        window.addEventListener('error', (e: Event) => {
            const target = e.target ? e.target : (e.srcElement as any)
            ErrorCatch.addErrorLogInfo({
                type: ErrorTypeEnum.RESOURCE,
                name: 'Resource Error!',
                file: (e.target || ({} as any)).currentSrc,
                detail: JSON.stringify({
                    tagName: target.localName,
                    html: target.outerHTML,
                    type: e.type
                }),
                url: window.location.href,
                stack: 'resource is not found',
                message: (e.target || ({} as any)).localName + ' is load error'
            })
        }, true)
    }

    /**
     * Add error info
     * @param info
     * @private
     */
    private static addErrorLogInfo (info: IErrorLogInfo) {
        const item = {
            ...info,
            time: formatToDateTime(new Date())
        }
        this.errorLogInfoList = [item, ...(this.errorLogInfoList || [])]
    }

    /**
     * Ajax Error Handler function
     * @param error
     */
    public static addAjaxErrorHandler (error: any) {
        const errorInfo: Partial<IErrorLogInfo> = {
            message: error.message,
            type: ErrorTypeEnum.AJAX
        }
        if (error.message) {
            const { config: { url = '', data: params = '', method = 'get', headers = {} } = {}, data = {} } = error
            errorInfo.url = url
            errorInfo.name = 'Ajax Error'
            errorInfo.file = '-'
            errorInfo.stack = JSON.stringify(data)
            errorInfo.detail = JSON.stringify({ params, method, headers })
        }
        ErrorCatch.addErrorLogInfo(errorInfo as IErrorLogInfo)
    }
}

export default ErrorCatch
