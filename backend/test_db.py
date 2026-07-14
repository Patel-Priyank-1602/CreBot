import asyncio

from utils.supabase_client import supabase


async def main():
    try:
        bots = supabase.table('bots').select('id').limit(1).execute()
        if not bots.data:
            return
        print("Bot ID:", bots.data[0]['id'])
        res = supabase.table('bots').update({'strict_knowledge': False}).eq('id', bots.data[0]['id']).execute()
        print('SUCCESS', res)
    except Exception as e:
        print('ERROR', e)

if __name__ == '__main__':
    asyncio.run(main())
