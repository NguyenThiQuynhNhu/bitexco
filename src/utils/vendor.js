import Strings from './languages';

export const converTypeToString = (type) => {
    switch (type) {
        case 0: return `${Strings.listVendor.option3}`;
        case 10: return `${Strings.listVendor.option2}`;
        default: return `${Strings.listVendor.option1}`;
    }
}