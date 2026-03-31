from HeirsDict import *
from fractions import Fraction as fra
from Functions import *
import os

S_value = 0
asabah = 0
pos = 0

def calculate_faraid_api(gender, total_assets, debt, funeral, will, nazar, net_asset, heirs):
    """
    API version of Faraid calculation
    Returns JSON-serializable results instead of printing
    """
    from fractions import Fraction as fra
    
    # Reset global dictionaries
    global male_heirs, female_heirs, heirs_number, portion, amount, S_value, asabah
    
    # Re-import to reset state
    from HeirsDict import male_heirs as mh, female_heirs as fh, heirs_number as hn, portion as p, amount as a
    
    # Create working copies
    male_heirs = dict(mh)
    female_heirs = dict(fh)
    heirs_number = dict(hn)
    portion = dict(p)
    amount = dict(a)
    
    try:
        # Remove spouse based on deceased gender
        if gender == "M":
            if "Husband" in male_heirs:
                male_heirs.pop("Husband")
            heirs_number["Husband"] = 0
        else:
            if "Wife" in female_heirs:
                female_heirs.pop("Wife")
            heirs_number["Wife"] = 0
        
        # Initialize heirs from input
        for heir_name, count in heirs.items():
            if heir_name in male_heirs:
                male_heirs[heir_name] = True
                heirs_number[heir_name] = count
            elif heir_name in female_heirs:
                female_heirs[heir_name] = True
                heirs_number[heir_name] = count
        
        # Set non-selected heirs to False
        for heir_name in male_heirs:
            if male_heirs[heir_name] is None:
                male_heirs[heir_name] = False
        
        for heir_name in female_heirs:
            if female_heirs[heir_name] is None:
                female_heirs[heir_name] = False
        
        # Determine calculation path based on heir status
        if all(male_heirs.values()) and all(female_heirs.values()):
            _calculate_all_heirs(gender, net_asset, male_heirs, female_heirs, heirs_number, portion, amount)
        elif all(male_heirs.values()) and not all(female_heirs.values()) and not any(female_heirs.values()):
            _calculate_male_only(gender, net_asset, male_heirs, female_heirs, heirs_number, portion, amount)
        elif all(female_heirs.values()) and not all(male_heirs.values()) and not any(male_heirs.values()):
            _calculate_female_only(gender, net_asset, male_heirs, female_heirs, heirs_number, portion, amount)
        else:
            _calculate_mixed(gender, net_asset, male_heirs, female_heirs, heirs_number, portion, amount)
        
        # Format results
        result_heirs = {}
        for heir_name in amount:
            if amount[heir_name] > 0 and heir_name in heirs_number and heirs_number[heir_name] > 0:
                result_heirs[heir_name] = {
                    "amount": round(amount[heir_name], 2),
                    "portion": str(fra(portion[heir_name]).limit_denominator(10)) if portion[heir_name] > 0 else "0",
                    "count": heirs_number[heir_name],
                    "total": round(amount[heir_name] * heirs_number[heir_name], 2)
                }
        
        return {
            "success": True,
            "estate": {
                "total_assets": total_assets,
                "debt": debt,
                "funeral": funeral,
                "will": will,
                "nazar": nazar,
                "net_asset": net_asset
            },
            "heirs": result_heirs,
            "total_distributed": round(sum(h["total"] for h in result_heirs.values()), 2)
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def _calculate_all_heirs(gender, net_asset, male_heirs, female_heirs, heirs_number, portion, amount):
    """Calculate when all heirs are present"""
    portion["Father"] = 1/6
    portion["Mother"] = 1/6
    if gender == "F":
        portion["Husband"] = 1/4
    else:
        portion["Wife"] = 1/8
    
    S_value = sum(portion.values())
    
    if S_value <= 1:
        amount["Father"] = portion["Father"] * net_asset
        amount["Mother"] = portion["Mother"] * net_asset
        if gender == "F":
            amount["Husband"] = portion["Husband"] * net_asset
        else:
            try:
                amount["Wife"] = (portion["Wife"] * net_asset) / heirs_number.get("Wife", 1)
            except:
                amount["Wife"] = 0
        
        asabah = net_asset - amount["Father"] - amount["Mother"] - amount.get("Husband", 0) - (amount.get("Wife", 0) * heirs_number.get("Wife", 1))
        if "Son" in heirs_number and "Daughter" in heirs_number and heirs_number.get("Son", 0) > 0:
            denominator = heirs_number["Son"] * 2 + heirs_number["Daughter"]
            amount["Son"] = 2/denominator * asabah
            amount["Daughter"] = 1/denominator * asabah
        else:
            amount["Son"] = asabah / max(heirs_number.get("Son", 1), 1)


def _calculate_male_only(gender, net_asset, male_heirs, female_heirs, heirs_number, portion, amount):
    """Calculate when only male heirs are present"""
    if gender == "F":
        portion["Husband"] = 1/4
        portion["Father"] = 1/6
        amount["Husband"] = portion["Husband"] * net_asset
        amount["Father"] = portion["Father"] * net_asset
        asabah = net_asset - amount["Husband"] - amount["Father"]
        amount["Son"] = asabah / max(heirs_number.get("Son", 1), 1)


def _calculate_female_only(gender, net_asset, male_heirs, female_heirs, heirs_number, portion, amount):
    """Calculate when only female heirs are present"""
    if gender == "M":
        portion["Wife"] = 1/8
        portion["Daughter"] = 1/2
        portion["Mother"] = 1/6
        portion["Granddaughter"] = 1/6
        amount["Wife"] = (portion["Wife"] * net_asset) / max(heirs_number.get("Wife", 1), 1)
        amount["Daughter"] = (portion["Daughter"] * net_asset) / max(heirs_number.get("Daughter", 1), 1)
        amount["Mother"] = portion["Mother"] * net_asset
        amount["Granddaughter"] = (portion["Granddaughter"] * net_asset) / max(heirs_number.get("Granddaughter", 1), 1)


def _calculate_mixed(gender, net_asset, male_heirs, female_heirs, heirs_number, portion, amount):
    """Calculate with mixed male and female heirs"""
    # Set portions based on Islamic law
    if gender == "F" and male_heirs.get("Husband"):
        if not any([male_heirs.get("Son"), male_heirs.get("Grandson"), female_heirs.get("Daughter"), female_heirs.get("Granddaughter")]):
            portion["Husband"] = 1/2
        else:
            portion["Husband"] = 1/4
    
    if male_heirs.get("Father") and any([male_heirs.get("Son"), male_heirs.get("Grandson"), female_heirs.get("Daughter"), female_heirs.get("Granddaughter")]):
        portion["Father"] = 1/6
    
    if female_heirs.get("Daughter"):
        if not male_heirs.get("Son") and heirs_number.get("Daughter", 0) == 1:
            portion["Daughter"] = 1/2
        elif not male_heirs.get("Son") and heirs_number.get("Daughter", 0) > 1:
            portion["Daughter"] = 2/3
    
    if female_heirs.get("Mother"):
        if not any([male_heirs.get("Son"), male_heirs.get("Grandson")]) and not male_heirs.get("Brother") and not female_heirs.get("Sister"):
            portion["Mother"] = 1/3
        else:
            portion["Mother"] = 1/6
    
    if gender == "M" and female_heirs.get("Wife"):
        if not any([male_heirs.get("Son"), male_heirs.get("Grandson"), female_heirs.get("Daughter"), female_heirs.get("Granddaughter")]):
            portion["Wife"] = 1/4
        else:
            portion["Wife"] = 1/8
    
    # Calculate amounts
    S_value = sum(portion.values())
    cumulative = 0
    
    if S_value <= 1:
        for heir in portion:
            if portion[heir] > 0 and heir in heirs_number and heirs_number[heir] > 0:
                amount[heir] = (portion[heir] * net_asset) / heirs_number[heir]
                cumulative += amount[heir] * heirs_number[heir]
    
    # Distribute remaining as asabah
    asabah = net_asset - cumulative
    if asabah > 0 and male_heirs.get("Son"):
        amount["Son"] = asabah / max(heirs_number.get("Son", 1), 1)
    elif asabah > 0 and male_heirs.get("Father"):
        amount["Father"] = portion.get("Father", 0) * net_asset + asabah
