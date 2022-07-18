import { NavigationActions, StackActions } from 'react-navigation';
import numeral from './numeral';
import moment from './moment';
import lodash from './lodash';


export const ChuyenTrang = async (screen,name,reset=false) => {
    // console.log(name)
    if (name === undefined) {
        screen.props.dispatch(NavigationActions.navigate({ routeName: 'Splash' }));
    }
    else{
        if(reset){
            const resetAction = StackActions.reset({
                index: 0,
                key: null, // <-- this
                actions: [NavigationActions.navigate({ routeName: name })]
            })
            screen.props.navigation.dispatch(resetAction)
        }
        else{
            screen.props.dispatch(NavigationActions.navigate({ routeName: name }));
        }
    }
}

export const getNumber = (number) => {
    return numeral(number).format('0,0');
}

export const getDate = (date, type) => {
    if (type === undefined)
        return moment(date).format('DD/MM/YYYY')
    else
        return moment(date).format(type)
}

export const getDateTime = (date, type) => {
    if (type === undefined)
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
    else
        return moment(date).format(type)
}
export const getDateApi = (date, type) => {
    if (type === undefined)
        return moment(date).format("YYYY-MM-DD[T00:00:00Z]")
    else
        return moment(date).format(type)
}
export const groupArray = (xs, key) => {
    // console.log('xs', xs)
    // console.log('key', key)
    return xs.reduce(function (rv, x) {
        // console.log('rv', rv)
        // console.log('x', x)
        let v = key instanceof Function ? key(x) : x[key];
        // console.log('v', v)
        //console.log('key(x)', key(x))
        //console.log('x[key]', x[key])
        let el = rv.find((r) => r && r.key === v);
        //console.log('el', el)
        if (el) {
            el.values.push(x);
        }
        else {
            rv.push({
                key: v,
                values: [x]
            });
        }
        //console.log('rv', rv)
        return rv;
    }, []);
}

export const sortAscending = (arr, key) => {
    return lodash.orderBy(arr, key, 'asc')
}

//https://stackoverflow.com/questions/22928841/lodash-multi-column-sortby-descending
export const sortDescending = (arr, key) => {
    return lodash.orderBy(arr, key, 'desc')
}