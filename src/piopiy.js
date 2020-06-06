
import _ from 'lodash';
import { EventEmitter } from 'events';
import ua from './userAgent';
import Audio from './audio';

const pkg = require( '../package.json' );






let userAgent = new ua();
let cmiAudio = new Audio();

export default class extends EventEmitter {



    constructor( options ) {
        super()
        this.piopiyOption = {};
        this.ua = {};
        let option = options || {};
        EventEmitter.bind( this );
        this.name = pkg.title;
        this.version = pkg.version;

        this.piopiyOption.debug = ( _.isBoolean( option.debug ) ) ? option.debug : false;
        this.piopiyOption.autoplay = _.isBoolean( option.autoplay ) ? option.autoplay : true;
        this.piopiyOption.autoReboot = _.isBoolean( option.autoReboot ) ? option.autoReboot : true;
        this.piopiyOption.ringTime = _.isNumber( option.ringTime ) ? option.ringTime : 60;
        this.piopiyOption.displayName = _.isString( option.name ) ? option.name : null;




    }



    login ( user_id, password ) {

        let _this = this;
        if ( _.isString( user_id ) && _.isString( password ) ) {
            var credentials = {
                uri: user_id + '@piopiysbc.telecmi.com',
                authorization_user: user_id,
                password: password,
                debug: this.piopiyOption.debug,
                display_name: this.piopiyOption.displayName,
                no_answer_timeout: this.piopiyOption.ringTime,
                register: true,
                register_expires: 300,
                connection_recovery_min_interval: 2,
                connection_recovery_max_interval: 3,
                session_timers: false
            }

            userAgent.start( credentials, _this );
        } else {
            throw new Error( "invalid user_id or password" );
        }
    }


    logout () {
        let _this = this;
        userAgent.stop( _this );
    }

    call ( to, media ) {
        let _this = this;
        if ( !_.isString( to ) ) {
            _this.emit( 'error', { code: 1002, status: 'Invalid type to call' } )
            return;
        }

        if ( !_.has( media, 'audio' ) || !_.has( media, 'video' ) ) {
            _this.emit( 'error', { code: 1002, status: 'Invalid media type to call' } )
            return;
        }

        if ( !_.isBoolean( media.audio ) || !_.isBoolean( media.video ) ) {
            _this.emit( 'error', { code: 1002, status: 'Invalid media type to call' } )
            return;
        }

        userAgent.make( to, _this, media );
    }

    terminate () {
        let _this = this;
        userAgent.terminate( _this );
    }



    answer ( media ) {
        let _this = this;

        if ( !_.has( media, 'audio' ) || !_.has( media, 'video' ) ) {
            _this.emit( 'error', { code: 1002, status: 'Invalid media type to call' } )
            return;
        }

        if ( !_.isBoolean( media.audio ) || !_.isBoolean( media.video ) ) {
            _this.emit( 'error', { code: 1002, status: 'Invalid media type to call' } )
            return;
        }
        userAgent.answer( _this, media );
    }
    reject () {
        let _this = this;
        userAgent.reject( _this );
    }

    sendDtmf ( no ) {
        let _this = this;
        userAgent.dtmf( no, _this );
    }

    hold () {
        let _this = this;
        userAgent.hold( _this );
    }

    unHold () {
        let _this = this;
        userAgent.unhold( _this );
    }

    mute () {

        let _this = this;
        userAgent.mute( _this );

    }

    unMute () {

        let _this = this;
        userAgent.unmute( _this );

    }

    isLogedIn () {
        let _this = this;
        return userAgent.islogedin( _this );
    }

    onHold () {
        let _this = this;
        return userAgent.onhold( _this );
    }

    onMute () {
        let _this = this;
        return userAgent.onmute( _this );
    }

}


